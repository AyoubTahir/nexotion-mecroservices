import { CONTAINER_TYPES } from "@notifications/core/interfaces/constants/container.types";
import { IHttpServer } from "@notifications/core/interfaces/http/server.interface";
import { LoggerConfiguration } from "@notifications/core/interfaces/logger/config.interface";
import { ILogger } from "@notifications/core/interfaces/logger/logger.interface";
import { RouteRegistrar } from "@notifications/core/routes/route-registrar";
import { Container } from "inversify";
import { ConfigService } from "./config/config.service";
import { IElasticsearchService } from "@notifications/core/interfaces/database/elasticsearch-service.interface";
import { IMessageBroker } from "@notifications/core/interfaces/messaging/message-broker.interface";
import { ConsumerRegistrar } from "@notifications/core/messaging/consumer-registrar";
//import { IEmailProvider } from "@notifications/core/interfaces/emails/email.interface";

export class ApplicationInitializer {
    private container: Container;
    private logger: ILogger;
  
    constructor(container: Container) {
      this.container = container;
      const loggerFactory = container.get<(conf: LoggerConfiguration) => ILogger>(CONTAINER_TYPES.ILogger);
      this.logger = loggerFactory({ name: "notificationApplicationInitializer" });
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

        /*await messageBroker.subscribe(
          'user.created', // routing key
          async (message) => {
            console.log('Received user creation event:', message);
          },
          'topic',        // exchange type
          'user-exchange' // optional custom exchange name
        )

        await messageBroker.publish(
          'user.created', // routing key
          {
            test: "test user created event with default exchange"
          }, 
          'topic',        // exchange type
          'user-exchange' // optional custom exchange name
        );*/
  
        // Email Provider
        /*const emailProvider = this.container.get<IEmailProvider>(CONTAINER_TYPES.IEmailProvider);
        await emailProvider.send({
          to: 'user@example.com',
          templateName: 'register',
          context: {
            username: 'John Doe',
            title: 'Welcome Aboard',
          }
        });*/

        // Register consumers
        const consumerRegistrar = this.container.get(ConsumerRegistrar);
        consumerRegistrar.registerAll();

        // Register routes
        const httpServer = this.container.get<IHttpServer>(CONTAINER_TYPES.IHttpServer);
        const routeRegistrar = this.container.get(RouteRegistrar);
        routeRegistrar.registerAll(httpServer);
  
        // Start HTTP server
        const port = configService.get('PORT', 3001);
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
  
      // TypeORM connection
      //const typeormConnection = this.container.get(TypeORMConnection);
      //await typeormConnection.connect();
    }
  }