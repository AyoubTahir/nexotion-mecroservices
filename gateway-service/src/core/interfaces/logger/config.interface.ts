export interface LoggerConfiguration {
    name: string;
    level?: string;
    destination?: string;
    metadata?: Record<string, any>;
}