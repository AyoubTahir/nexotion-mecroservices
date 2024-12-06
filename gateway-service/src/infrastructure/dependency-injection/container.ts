import { CONTAINER_TYPES } from "@gateway/core/interfaces/constants/container.types";
import { IHttpServer } from "@gateway/core/interfaces/http/server.interface";
import { ILogger } from "@gateway/core/interfaces/logger/logger.interface";
import { Container } from "inversify";
import { WinstonLogger } from "../logger/winston.logger";
import { LoggerConfiguration } from "@gateway/core/interfaces/logger/config.interface";
import { ExpressServer } from "../http/express/server";
import { RouteRegistrar } from "@gateway/core/http/route-registrar";
import { IRoutes } from "@gateway/core/interfaces/http/routes.interface";
import { HealthRoutes } from "@gateway/presentation/http/routes/health.routes";
import { IHealthController } from "@gateway/core/interfaces/controllers/health-controller.interface";
import { HealthController } from "@gateway/presentation/http/controllers/health.controller";
import { ConfigService } from "../config/config.service";
import { IElasticsearchService } from "@gateway/core/interfaces/database/elasticsearch-service.interface";
import { ElasticsearchService } from "../databases/elasticsearch.service";
import { ITokenService } from "@gateway/core/interfaces/common/token-service.interface";
import { JwtTokenService } from "../common/jwt-token.service";
import { IProxyService } from "@gateway/core/interfaces/http/proxy-service.interface";
import { AxiosProxyService } from "../http/services/axios-proxy.service";
import { IRouteResolver } from "@gateway/core/interfaces/common/route-resolver.interface";
import { RouteResolver } from "../common/route-resolver";
import { MiddlewareRegistrar } from "@gateway/core/http/middleware-registrar";

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

// Bind Middleware Registrar
container.bind(MiddlewareRegistrar).toSelf().inSingletonScope();

// Bind Route Registrar
container.bind(RouteRegistrar).toSelf().inSingletonScope();

// services
container.bind<ITokenService>(CONTAINER_TYPES.ITokenService).to(JwtTokenService).inSingletonScope();
container.bind<IProxyService>(CONTAINER_TYPES.IProxyService).to(AxiosProxyService).inSingletonScope();
container.bind<IRouteResolver>(CONTAINER_TYPES.IRouteResolver).to(RouteResolver).inSingletonScope();

// Bind controllers
container.bind<IHealthController>(CONTAINER_TYPES.IHealthController).to(HealthController).inSingletonScope();

// Bind Routes
container.bind<IRoutes>(CONTAINER_TYPES.IRoutes).to(HealthRoutes).inSingletonScope();