import { CONTAINER_TYPES } from "@auth/core/interfaces/constants/container.types";
import { IHttpServer } from "@auth/core/interfaces/http/server.interface";
import { LoggerConfiguration } from "@auth/core/interfaces/logger/config.interface";
import { ILogger } from "@auth/core/interfaces/logger/logger.interface";
import { RouteRegistrar } from "@auth/core/http/route-registrar";
import { Container } from "inversify";
import { ConfigService } from "./config/config.service";
import { IElasticsearchService } from "@auth/core/interfaces/database/elasticsearch-service.interface";
import { IMessageBroker } from "@auth/core/interfaces/messaging/message-broker.interface";
import { ConsumerRegistrar } from "@auth/core/messaging/consumer-registrar";
import { MiddlewareRegistrar } from "@auth/core/http/middleware-registrar";
import { IOrmAdapter } from "@auth/core/interfaces/database/orm-adapter.interface";
import { IRedisRepository } from "@auth/core/interfaces/database/redis-repository.interface";

export class ApplicationInitializer {
    private container: Container;
    private logger: ILogger;
  
    constructor(container: Container) {
      this.container = container;
      const loggerFactory = container.get<(conf: LoggerConfiguration) => ILogger>(CONTAINER_TYPES.ILogger);
      this.logger = loggerFactory({ name: "authApplicationInitializer" });
    }
  
    async initialize(): Promise<void> {
      try {
        // Load environment configuration
        const configService = this.container.get(ConfigService);
        configService.loadEnvironment();
  
        // Initialize databases connections
        await this.initializeDatabaseConnections();

        // Initialize message broker
        const messageBroker = this.container.get<IMessageBroker>(CONTAINER_TYPES.IMessageBroker);
        await messageBroker.connect();

        // Register consumers
        const consumerRegistrar = this.container.get(ConsumerRegistrar);
        consumerRegistrar.registerAll();

        const httpServer = this.container.get<IHttpServer>(CONTAINER_TYPES.IHttpServer);

        // Register middlewares
        const middlewareRegistrar = this.container.get(MiddlewareRegistrar);
        middlewareRegistrar.registerAll(httpServer);

        // Register routes
        const routeRegistrar = this.container.get(RouteRegistrar);
        routeRegistrar.registerAll(httpServer);
  
        // Start HTTP server
        const port = configService.get('PORT', 3002);
        await httpServer.start(port);
  
        this.logger.info('Auth Application initialized successfully');
      } catch (error: any) {
        this.logger.error('Auth Application initialization failed', error);
        process.exit(1);
      }
    }
  
    private async initializeDatabaseConnections(): Promise<void> {
      // Elasticsearch connection
      const elasticsearch = this.container.get<IElasticsearchService>(CONTAINER_TYPES.IElasticsearchService);
      await elasticsearch.connect();

      // Redis connection
      const redis = this.container.get<IRedisRepository>(CONTAINER_TYPES.IRedisRepository);
      await redis.connect();

      // Orm Adapter DB connection
      const ormAdapter = this.container.get<IOrmAdapter>(CONTAINER_TYPES.IOrmAdapter);
      await ormAdapter.connect();
    }
  }