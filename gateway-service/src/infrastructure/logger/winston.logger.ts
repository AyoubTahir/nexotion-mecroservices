import { createLogger } from "@ayoubtahir/nexotion-shared";
import { LoggerConfiguration } from "@gateway/core/interfaces/logger/config.interface";
import { ILogger } from "@gateway/core/interfaces/logger/logger.interface";
import { injectable } from "inversify";

@injectable()
export class WinstonLogger implements ILogger {
    private logger: ILogger

    constructor(
        config: LoggerConfiguration,
    ) {
        this.logger = createLogger({
            ...config,
            destination: "http://localhost:9200" 
        });
    }

    log(level: string, message: string, meta?: Record<string, any>): void{
        this.logger.log(level, message, meta)
    }
    error(message: string, meta?: Record<string, any>): void{
        this.logger.error(message, meta)
    }
    warn(message: string, meta?: Record<string, any>): void{
        this.logger.warn(message, meta)
    }
    info(message: string, meta?: Record<string, any>): void{
        this.logger.info(message, meta)
    }
    debug(message: string, meta?: Record<string, any>): void{
        this.logger.debug(message, meta)
    }
}