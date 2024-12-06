export interface LoggerTransport {
    log(level: string, message: string, metadata?: Record<string, any>): void;
    error(message: string, metadata?: Record<string, any>): void;
    warn(message: string, metadata?: Record<string, any>): void;
    info(message: string, metadata?: Record<string, any>): void;
    debug(message: string, metadata?: Record<string, any>): void;
}
  
export interface LoggerFactory {
    createLogger(config: LoggerConfiguration): LoggerTransport;
}
  
export interface LoggerConfiguration {
    name: string;
    level?: string;
    destination?: string;
    metadata?: Record<string, any>;
}
  
  // Abstract logger implementation
export class LoggingService {
    private static instance: LoggingService;
    private loggerFactory: LoggerFactory;
  
    private constructor(factory: LoggerFactory) {
      this.loggerFactory = factory;
    }
  
    // Singleton with factory injection
    public static initialize(factory: LoggerFactory): LoggingService {
      if (!LoggingService.instance) {
        LoggingService.instance = new LoggingService(factory);
      }
      return LoggingService.instance;
    }
  
    public static getInstance(): LoggingService {
      if (!LoggingService.instance) {
        throw new Error('LoggingService not initialized. Call initialize first.');
      }
      return LoggingService.instance;
    }
  
    // Create logger with flexible configuration
    createLogger(config: LoggerConfiguration): LoggerTransport {
      return this.loggerFactory.createLogger(config);
    }
}