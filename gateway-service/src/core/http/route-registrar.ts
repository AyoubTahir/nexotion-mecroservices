import { injectable, multiInject, optional } from "inversify";
import { IRoutes } from "../interfaces/http/routes.interface";
import { CONTAINER_TYPES } from "../interfaces/constants/container.types";
import { IHttpServer } from "../interfaces/http/server.interface";

@injectable()
export class RouteRegistrar {
  constructor(
    @multiInject(CONTAINER_TYPES.IRoutes) @optional() private routes: IRoutes[]
  ) {}

  registerAll(httpServer: IHttpServer): void {
    this.routes.forEach(routeModule => {
      try {
        routeModule.register(httpServer);
      } catch (error) {
        console.error(`Failed to register routes for ${routeModule.constructor.name}:`, error);
      }
    });
  }
}