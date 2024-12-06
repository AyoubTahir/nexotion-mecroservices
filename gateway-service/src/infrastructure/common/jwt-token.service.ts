import jwt from "jsonwebtoken"
import { ITokenService, TokenPayload } from "@gateway/core/interfaces/common/token-service.interface";
import { inject, injectable } from "inversify";
import { ConfigService } from "../config/config.service";
import { CONTAINER_TYPES } from "@gateway/core/interfaces/constants/container.types";
import { LoggerConfiguration } from "@ayoubtahir/nexotion-shared/types/logger/logger-service";
import { ILogger } from "@gateway/core/interfaces/logger/logger.interface";

@injectable()
export class JwtTokenService implements ITokenService {
    private logger: ILogger

    constructor(
        @inject(ConfigService) private config: ConfigService,
        @inject(CONTAINER_TYPES.ILogger) loggerFactory: (conf: LoggerConfiguration) => ILogger
    ){
        this.logger = loggerFactory({ name: "gatewayJwtTokenService" });
    }
  
    generateToken(payload: TokenPayload, expiresIn = '1h'): string {
      try {
        return jwt.sign(payload, this.config.get('JWT_SECRET', ''), { expiresIn });
      } catch (error: any) {
        this.logger.error('Token generation failed', error);
        throw new Error('Token generation failed');
      }
    }
  
    validateToken(token: string): TokenPayload {
      try {
        return jwt.verify(token, this.config.get('JWT_SECRET', '')) as TokenPayload;
      } catch (error: any) {
        this.logger.error('Token validation failed', error);
        throw new Error('Invalid or expired token');
      }
    }
  
    refreshToken(token: string): string {
      const decoded = this.validateToken(token);
      return this.generateToken({
        userId: decoded.userId,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        email: decoded.email,
        roles: decoded.roles
      });
    }
  
    generateServiceToken(serviceName: string): string {
      return jwt.sign({ service: serviceName }, this.config.get('MICROSERVICE_JWT_SECRET', ''), { expiresIn: '5m' });
    }
}