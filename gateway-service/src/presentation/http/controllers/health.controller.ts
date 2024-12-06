import { CONTAINER_TYPES } from "@gateway/core/interfaces/constants/container.types";
import { IHealthController } from "@gateway/core/interfaces/controllers/health-controller.interface";
import { IRequest } from "@gateway/core/interfaces/http/request.interface";
import { IResponse } from "@gateway/core/interfaces/http/response.interface";
import { LoggerConfiguration } from "@gateway/core/interfaces/logger/config.interface";
import { ILogger } from "@gateway/core/interfaces/logger/logger.interface";
import { inject, injectable } from "inversify";

@injectable()
export  class HealthController implements IHealthController {
  private logger: ILogger
  constructor(
    @inject(CONTAINER_TYPES.ILogger) loggerFactory: (conf: LoggerConfiguration) => ILogger
  ) {
    this.logger = loggerFactory({ name: "gatewayHealthController" });
  }

  async health(_: IRequest, res: IResponse): Promise<void> {
    //health check
    this.logger.info("Health check successful");
    res.status(200).json({ message: "Health check successful" });
  }
}