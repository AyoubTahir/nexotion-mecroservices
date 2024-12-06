import { CONTAINER_TYPES } from "@auth/core/interfaces/constants/container.types";
import { IHealthController } from "@auth/core/interfaces/controllers/health-controller.interface";
import { IHttpServer } from "@auth/core/interfaces/http/server.interface";
import { IRoutes } from "@auth/core/interfaces/http/routes.interface";
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