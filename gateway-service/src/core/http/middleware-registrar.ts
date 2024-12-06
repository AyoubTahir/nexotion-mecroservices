import { injectable, multiInject, optional } from "inversify";
import { CONTAINER_TYPES } from "../interfaces/constants/container.types";
import { IHttpServer } from "../interfaces/http/server.interface";
import { IMiddlewares } from "../interfaces/http/middleware.interface";

@injectable()
export class MiddlewareRegistrar {
  constructor(
    @multiInject(CONTAINER_TYPES.IMiddlewares) @optional() private middlewares: IMiddlewares[]
  ) {}

  registerAll(httpServer: IHttpServer): void {
    this.middlewares.forEach(middleware => {
      try {
        middleware.register(httpServer);
      } catch (error) {
        console.error(`Failed to register middleware for ${middleware.constructor.name}:`, error);
      }
    });
  }
}