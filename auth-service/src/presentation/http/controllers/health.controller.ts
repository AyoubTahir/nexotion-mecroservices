import { CONTAINER_TYPES } from "@auth/core/interfaces/constants/container.types";
import { IHealthController } from "@auth/core/interfaces/controllers/health-controller.interface";
import { IRequest } from "@auth/core/interfaces/http/request.interface";
import { IResponse } from "@auth/core/interfaces/http/response.interface";
import { LoggerConfiguration } from "@auth/core/interfaces/logger/config.interface";
import { ILogger } from "@auth/core/interfaces/logger/logger.interface";
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
    this.logger.info("Auth Health check successful");
    res.status(200).json({ message: "Auth Health check successful" });
  }
}