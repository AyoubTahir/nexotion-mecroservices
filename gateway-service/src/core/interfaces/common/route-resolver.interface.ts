import { IServiceConfig } from "@gateway/core/constants/microservice.config";

export interface IRouteResolver {
    resolveRoute(requestPath: string, method: string): IServiceConfig | null;
}