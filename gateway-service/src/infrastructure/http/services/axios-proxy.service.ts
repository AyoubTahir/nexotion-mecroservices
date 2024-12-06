import { LoggerConfiguration } from "@ayoubtahir/nexotion-shared/types/logger/logger-service";
import { MICROSERVICES_CONFIG } from "@gateway/core/constants/microservice.config";
import { ITokenService } from "@gateway/core/interfaces/common/token-service.interface";
import { CONTAINER_TYPES } from "@gateway/core/interfaces/constants/container.types";
import { IProxyService } from "@gateway/core/interfaces/http/proxy-service.interface";
import { ILogger } from "@gateway/core/interfaces/logger/logger.interface";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { inject, injectable } from "inversify";

@injectable()
export class AxiosProxyService implements IProxyService {
  private logger: ILogger
  private axiosInstances: Map<string, AxiosInstance> = new Map();
  private circuitState: Map<string, {
    failures: any;
    status: string;
    lastFailure: number;
  }> = new Map();

  constructor(
    @inject(CONTAINER_TYPES.ITokenService) private tokenService: ITokenService, 
    @inject(CONTAINER_TYPES.ILogger) loggerFactory: (conf: LoggerConfiguration) => ILogger
  ) {
    this.logger = loggerFactory({ name: "gatewayAxiosProxyService" });
    this.initializeAxiosInstances();
  }

  private initializeAxiosInstances() {
    Object.entries(MICROSERVICES_CONFIG).forEach(([serviceName, serviceConfig]) => {
      const axiosInstance = axios.create({
        baseURL: serviceConfig.baseUrl,
        timeout: 10000
      });

      axiosInstance.interceptors.request.use(async (config) => {
        try {
          const serviceToken = this.tokenService.generateServiceToken(serviceName);
          config.headers['Authorization'] = `Bearer ${serviceToken}`;
          return config;
        } catch (error: any) {
          this.logger.error('Failed to generate service token', error);
          throw error;
        }
      });

      this.axiosInstances.set(serviceName, axiosInstance);
    });
  }

  async proxyRequest(
    serviceName: string, 
    route: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE', 
    data?: any
  ): Promise<AxiosResponse> {
    if (this.isCircuitOpen(serviceName)) {
      throw new Error(`Circuit is OPEN for service: ${serviceName}`);
    }

    const axiosInstance = this.axiosInstances.get(serviceName);
    if (!axiosInstance) {
      throw new Error(`Service ${serviceName} not configured`);
    }

    try {
      const response = await this.executeRequestWithRetry(
        serviceName, 
        { method, url: route, data }, 
        axiosInstance
      );
      this.resetCircuitBreaker(serviceName);
      return response;
    } catch (error: any) {
      this.triggerCircuitBreaker(serviceName);
      this.logger.error(`Proxy request failed for ${serviceName}${route}`, error);
      throw error;
    }
  }

  private async executeRequestWithRetry(
    serviceName: string,
    requestConfig: AxiosRequestConfig,
    axiosInstance: AxiosInstance,
    retriesLeft = 3
  ): Promise<AxiosResponse> {
    try {
      return await axiosInstance.request(requestConfig);
    } catch (error) {
      if (retriesLeft === 0) throw error;

      await this.backoff(3 - retriesLeft);
      return this.executeRequestWithRetry(
        serviceName, 
        requestConfig, 
        axiosInstance,
        retriesLeft - 1
      );
    }
  }

  private async backoff(retriedCount: number): Promise<void> {
    const delay = Math.pow(2, retriedCount) * 1000;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  private isCircuitOpen(serviceName: string): boolean {
    const state = this.circuitState.get(serviceName);
    return state?.status === 'OPEN' && 
           (Date.now() - state.lastFailure) < 30000;
  }

  private triggerCircuitBreaker(serviceName: string) {
    const currentState = this.circuitState.get(serviceName) || {
      failures: 0,
      status: 'CLOSED',
      lastFailure: 0
    };

    const updatedState = {
      failures: currentState.failures + 1,
      status: currentState.failures >= 3 ? 'OPEN' : 'CLOSED',
      lastFailure: Date.now()
    };

    this.circuitState.set(serviceName, updatedState);
  }

  private resetCircuitBreaker(serviceName: string) {
    this.circuitState.set(serviceName, {
      failures: 0,
      status: 'CLOSED',
      lastFailure: 0
    });
  }
}