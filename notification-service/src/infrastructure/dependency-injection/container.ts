import { CONTAINER_TYPES } from "@notifications/core/interfaces/constants/container.types";
import { IHttpServer } from "@notifications/core/interfaces/http/server.interface";
import { ILogger } from "@notifications/core/interfaces/logger/logger.interface";
import { Container } from "inversify";
import { WinstonLogger } from "../logger/winston.logger";
import { LoggerConfiguration } from "@notifications/core/interfaces/logger/config.interface";
import { ExpressServer } from "../http/express/server";
import { RouteRegistrar } from "@notifications/core/routes/route-registrar";
import { IRoutes } from "@notifications/core/interfaces/routes/routes.interface";
import { HealthRoutes } from "@notifications/presentation/http/routes/health.routes";
import { IHealthController } from "@notifications/core/interfaces/controllers/health-controller.interface";
import { HealthController } from "@notifications/presentation/http/controllers/health.controller";
import { ConfigService } from "../config/config.service";
import { IElasticsearchService } from "@notifications/core/interfaces/database/elasticsearch-service.interface";
import { ElasticsearchService } from "../databases/elasticsearch.service";
import { IMessageBroker } from "@notifications/core/interfaces/messaging/message-broker.interface";
import { RabbitMQBroker } from "../messaging/rabbitmq/rabbitmq-broker";
import { IEmailProvider } from "@notifications/core/interfaces/emails/email.interface";
import { NodemailerEmailProvider } from "../emails/providers/nodemailer.provider";
import { ConsumerRegistrar } from "@notifications/core/messaging/consumer-registrar";
import { IConsumers } from "@notifications/core/interfaces/messaging/consumers.interface";
import { NewUserRegistrationEmailConsumer } from "../messaging/consumers/new-user-registration-email.consumer";
import { IAuthEmailService } from "@notifications/application/interfaces/auth-email.interface";
import { AuthEmailService } from "@notifications/application/services/auth-email.service";
//import { KafkaBroker } from "../messaging/kafka/kafka-broker";

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

// Bind Message Broker
container.bind<IMessageBroker>(CONTAINER_TYPES.IMessageBroker).to(RabbitMQBroker).inSingletonScope();

// Bind Email Provider
container.bind<IEmailProvider>(CONTAINER_TYPES.IEmailProvider).to(NodemailerEmailProvider).inSingletonScope();

// Bind Consumer Registrar
container.bind(ConsumerRegistrar).toSelf().inSingletonScope();

// Bind Route Registrar
container.bind(RouteRegistrar).toSelf().inSingletonScope();

// Bind Consumers
container.bind<IConsumers>(CONTAINER_TYPES.IConsumers).to(NewUserRegistrationEmailConsumer).inSingletonScope();

// Bind Services
container.bind<IAuthEmailService>(CONTAINER_TYPES.IAuthEmailService).to(AuthEmailService).inSingletonScope();

// Bind controllers
container.bind<IHealthController>(CONTAINER_TYPES.IHealthController).to(HealthController).inSingletonScope();

// Bind Routes
container.bind<IRoutes>(CONTAINER_TYPES.IRoutes).to(HealthRoutes).inSingletonScope();