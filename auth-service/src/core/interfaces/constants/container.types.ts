export const CONTAINER_TYPES = {
    // HTTP Server
    IHttpServer: Symbol('IHttpServer'),
    
    // Logger
    ILogger: Symbol('ILogger'),

    // Database Elasticsearch
    IElasticsearchService: Symbol('IElasticsearchService'),
    IOrmAdapter: Symbol('IOrmAdapter'),
    IRedisRepository: Symbol('IRedisRepository'),

    // Message Broker
    IMessageBroker: Symbol('IMessageBroker'),

    //Middlewares
    IMiddlewares: Symbol('IMiddlewares'),

    // Routes
    IRoutes: Symbol('IRoutes'),

    // Consumers
    IConsumers: Symbol('IConsumers'),

    // Repositories
    IUserRepository: Symbol('IUserRepository'),

    // Services
    IEncryptionService: Symbol('IEncryptionService'),
    IPasswordService: Symbol('IEncryptionService'),
    IAuthService: Symbol('IAuthService'),
    ITokenService: Symbol('ITokenService'),

    // Controllers
    IHealthController: Symbol('IHealthController'),
};