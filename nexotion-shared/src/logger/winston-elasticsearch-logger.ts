import winston, { Logger } from 'winston';
import { ElasticsearchTransformer, ElasticsearchTransport, LogData, TransformedData } from 'winston-elasticsearch';
import { LoggerTransport, LoggerFactory, LoggerConfiguration } from './logger-service';

export class WinstonLoggerFactory implements LoggerFactory {
  createLogger(config: LoggerConfiguration): LoggerTransport {
    const { 
      name, 
      level = 'info', 
      destination = 'http://localhost:9200',
      metadata = {} 
    } = config;

    // Elasticsearch transformer
    const esTransformer = (logData: LogData): TransformedData => {
      return ElasticsearchTransformer(logData);
    };

    // Elasticsearch transport configuration
    const esTransport: ElasticsearchTransport = new ElasticsearchTransport({
      level,
      transformer: esTransformer,
      clientOpts: {
        node: destination,
        maxRetries: 3,
        requestTimeout: 10000,
        sniffOnStart: false,
      }
    });

    // Create Winston logger
    const logger: Logger = winston.createLogger({
      exitOnError: false,
      defaultMeta: { 
        service: name,
        ...metadata 
      },
      transports: [
        new winston.transports.Console({
          level,
          handleExceptions: true,
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        }),
        esTransport
      ]
    });

    // Wrap Winston logger to match LoggerTransport interface
    return {
      log: (level: string, message: string, meta?: Record<string, any>) => 
        logger.log(level, message, meta),
      error: (message: string, meta?: Record<string, any>) => 
        logger.error(message, meta),
      warn: (message: string, meta?: Record<string, any>) => 
        logger.warn(message, meta),
      info: (message: string, meta?: Record<string, any>) => 
        logger.info(message, meta),
      debug: (message: string, meta?: Record<string, any>) => 
        logger.debug(message, meta)
    };
  }
}