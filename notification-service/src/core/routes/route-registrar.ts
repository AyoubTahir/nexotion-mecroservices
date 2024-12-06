import { injectable, multiInject, optional } from "inversify";
import { IRoutes } from "../interfaces/routes/routes.interface";
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
        console.log(`Registered routes for: ${routeModule.constructor.name}`);
      } catch (error) {
        console.error(`Failed to register routes for ${routeModule.constructor.name}:`, error);
      }
    });
  }
}