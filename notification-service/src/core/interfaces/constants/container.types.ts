export const CONTAINER_TYPES = {
    // HTTP Server
    IHttpServer: Symbol('IHttpServer'),
    
    // Logger
    ILogger: Symbol('ILogger'),

    // Database Elasticsearch
    IElasticsearchService: Symbol('IElasticsearchService'),

    // Message Broker
    IMessageBroker: Symbol('IMessageBroker'),

    // Email Provider
    IEmailProvider: Symbol('IEmailProvider'),

    // Routes
    IRoutes: Symbol('IRoutes'),

    // Consumers
    IConsumers: Symbol('IConsumers'),

    // Controllers
    IHealthController: Symbol('IHealthController'),

    // Services
    IAuthEmailService: Symbol('IAuthEmailService'),
};