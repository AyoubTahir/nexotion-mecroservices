import { LoggerConfiguration, LoggingService } from "./logger-service";
import { WinstonLoggerFactory } from "./winston-elasticsearch-logger";

export function createLogger(config: LoggerConfiguration, type?: string){
    
    switch(type){
        case "winston":
            LoggingService.initialize(new WinstonLoggerFactory());
        default:
            LoggingService.initialize(new WinstonLoggerFactory());
    }

    return LoggingService.getInstance().createLogger(config);
}