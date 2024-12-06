import { CONTAINER_TYPES } from "@gateway/core/interfaces/constants/container.types";
import { IHealthController } from "@gateway/core/interfaces/controllers/health-controller.interface";
import { IHttpServer } from "@gateway/core/interfaces/http/server.interface";
import { IRoutes } from "@gateway/core/interfaces/http/routes.interface";
import { inject, injectable } from "inversify";

@injectable()
export class HealthRoutes implements IRoutes {
  constructor(
    @inject(CONTAINER_TYPES.IHealthController) private controller: IHealthController
  ) {}

  register(httpServer: IHttpServer): void {
    httpServer.registerRoute('get', '/health', this.controller.health.bind(this.controller));
  }
}