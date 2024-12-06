import { CONTAINER_TYPES } from "@auth/core/interfaces/constants/container.types";
import { IHttpServer } from "@auth/core/interfaces/http/server.interface";
import { ILogger } from "@auth/core/interfaces/logger/logger.interface";
import { Container } from "inversify";
import { WinstonLogger } from "../logger/winston.logger";
import { LoggerConfiguration } from "@auth/core/interfaces/logger/config.interface";
import { ExpressServer } from "../http/express/server";
import { RouteRegistrar } from "@auth/core/http/route-registrar";
import { IRoutes } from "@auth/core/interfaces/http/routes.interface";
import { HealthRoutes } from "@auth/presentation/http/routes/health.routes";
import { IHealthController } from "@auth/core/interfaces/controllers/health-controller.interface";
import { HealthController } from "@auth/presentation/http/controllers/health.controller";
import { ConfigService } from "../config/config.service";
import { IElasticsearchService } from "@auth/core/interfaces/database/elasticsearch-service.interface";
import { ElasticsearchService } from "../databases/elasticsearch.service";
import { IMessageBroker } from "@auth/core/interfaces/messaging/message-broker.interface";
import { RabbitMQBroker } from "../messaging/rabbitmq/rabbitmq-broker";
import { ConsumerRegistrar } from "@auth/core/messaging/consumer-registrar";
import { MiddlewareRegistrar } from "@auth/core/http/middleware-registrar";
import { IOrmAdapter } from "@auth/core/interfaces/database/orm-adapter.interface";
import { PrismaOrmAdapter } from "../databases/orm/prisma/prisma.adapter";
import { IUserRepository } from "@auth/domain/interfaces/repositories/user-repository.interface";
import { UserRepository } from "../databases/orm/prisma/repositories/user.repository";
import { IEncryptionService } from "@auth/core/interfaces/services/encryption-service.interface";
import { EncryptionService } from "../common/encryption.service";
import { IAuthService } from "@auth/domain/interfaces/services/auth-service.interface";
import { AuthService } from "@auth/application/services/auth.service";
import { IRedisRepository } from "@auth/core/interfaces/database/redis-repository.interface";
import { RedisRepository } from "../databases/redis.repository";
import { ITokenService } from "@auth/domain/interfaces/services/token-service.interface";
import { TokenService } from "@auth/application/services/token.service";


export const container = new Container();

// Bind HTTP Server
container.bind<IHttpServer>(CONTAINER_TYPES.IHttpServer).to(ExpressServer).inSingletonScope();

// Bind Config Service
container.bind(ConfigService).toSelf().inSingletonScope();

// Bind Logger
container.bind<ILogger>(CONTAINER_TYPES.ILogger).toFactory<ILogger, [LoggerConfiguration]>(() => {
    return (conf: LoggerConfiguration) => new WinstonLogger(conf);
});

// Bind Databases
container.bind<IElasticsearchService>(CONTAINER_TYPES.IElasticsearchService).to(ElasticsearchService).inSingletonScope();
container.bind<IOrmAdapter>(CONTAINER_TYPES.IOrmAdapter).to(PrismaOrmAdapter).inSingletonScope();
container.bind<IRedisRepository>(CONTAINER_TYPES.IRedisRepository).to(RedisRepository).inSingletonScope();

// Bind Message Broker
container.bind<IMessageBroker>(CONTAINER_TYPES.IMessageBroker).to(RabbitMQBroker).inSingletonScope();

// Bind Consumer Registrar
container.bind(ConsumerRegistrar).toSelf().inSingletonScope();

// Bind Middleware Registrar
container.bind(MiddlewareRegistrar).toSelf().inSingletonScope();

// Bind Route Registrar
container.bind(RouteRegistrar).toSelf().inSingletonScope();

// Bind Consumers


// Bind Repositories
container.bind<IUserRepository>(CONTAINER_TYPES.IUserRepository).to(UserRepository).inSingletonScope();

// Bind Services
container.bind<IEncryptionService>(CONTAINER_TYPES.IEncryptionService).to(EncryptionService).inSingletonScope();
container.bind<IAuthService>(CONTAINER_TYPES.IAuthService).to(AuthService).inSingletonScope();
container.bind<ITokenService>(CONTAINER_TYPES.ITokenService).to(TokenService).inSingletonScope();

// Bind controllers
container.bind<IHealthController>(CONTAINER_TYPES.IHealthController).to(HealthController).inSingletonScope();

// Bind Routes
container.bind<IRoutes>(CONTAINER_TYPES.IRoutes).to(HealthRoutes).inSingletonScope();