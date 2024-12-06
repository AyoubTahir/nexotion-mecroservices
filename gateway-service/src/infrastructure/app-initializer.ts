import { CONTAINER_TYPES } from "@gateway/core/interfaces/constants/container.types";
import { IHttpServer } from "@gateway/core/interfaces/http/server.interface";
import { LoggerConfiguration } from "@gateway/core/interfaces/logger/config.interface";
import { ILogger } from "@gateway/core/interfaces/logger/logger.interface";
import { RouteRegistrar } from "@gateway/core/http/route-registrar";
import { Container } from "inversify";
import { ConfigService } from "./config/config.service";
import { IElasticsearchService } from "@gateway/core/interfaces/database/elasticsearch-service.interface";
import { MiddlewareRegistrar } from "@gateway/core/http/middleware-registrar";


export class ApplicationInitializer {
    private container: Container;
    private logger: ILogger;
  
    constructor(container: Container) {
      this.container = container;
      const loggerFactory = container.get<(conf: LoggerConfiguration) => ILogger>(CONTAINER_TYPES.ILogger);
      this.logger = loggerFactory({ name: "gatewayApplicationInitializer" });
    }
  
    async initialize(): Promise<void> {
      try {
        // Load environment configuration
        const configService = this.container.get(ConfigService);
        configService.loadEnvironment();
  
        // Initialize databases connections
        await this.initializeDatabaseConnections();

        const httpServer = this.container.get<IHttpServer>(CONTAINER_TYPES.IHttpServer);
        
        // Register middlewares
        const middlewareRegistrar = this.container.get(MiddlewareRegistrar);
        middlewareRegistrar.registerAll(httpServer);

        // Register routes
        const routeRegistrar = this.container.get(RouteRegistrar);
        routeRegistrar.registerAll(httpServer);
  
        // Start HTTP server
        const port = configService.get('PORT', 3000);
        await httpServer.start(port);
  
        this.logger.info('Application initialized successfully');
      } catch (error: any) {
        this.logger.error('Application initialization failed', error);
        process.exit(1);
      }
    }
  
    private async initializeDatabaseConnections(): Promise<void> {
      // Elasticsearch connection
      const elasticsearch = this.container.get<IElasticsearchService>(CONTAINER_TYPES.IElasticsearchService);
      await elasticsearch.connect();
    }
  }