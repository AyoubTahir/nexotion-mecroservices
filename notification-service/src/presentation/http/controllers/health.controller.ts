import { CONTAINER_TYPES } from "@notifications/core/interfaces/constants/container.types";
import { IHealthController } from "@notifications/core/interfaces/controllers/health-controller.interface";
import { IRequest } from "@notifications/core/interfaces/http/request.interface";
import { IResponse } from "@notifications/core/interfaces/http/response.interface";
import { LoggerConfiguration } from "@notifications/core/interfaces/logger/config.interface";
import { ILogger } from "@notifications/core/interfaces/logger/logger.interface";
import { inject, injectable } from "inversify";

@injectable()
export  class HealthController implements IHealthController {
  private logger: ILogger
  constructor(
    @inject(CONTAINER_TYPES.ILogger) loggerFactory: (conf: LoggerConfiguration) => ILogger
    //protected service: IService<T>
  ) {
    this.logger = loggerFactory({ name: "notificationHealthController" });
  }

  async health(_: IRequest, res: IResponse): Promise<void> {
    //health check
    // const result = await this.service.healthCheck();
    this.logger.info("Health check successful");
    res.status(200).json({ message: "Health check successful" });
  }
}