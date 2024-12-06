export const CONTAINER_TYPES = {
    // HTTP Server
    IHttpServer: Symbol('IHttpServer'),
    
    // Logger
    ILogger: Symbol('ILogger'),

    // Database Elasticsearch
    IElasticsearchService: Symbol('IElasticsearchService'),

    //Middlewares
    IMiddlewares: Symbol('IMiddlewares'),

    // services
    ITokenService: Symbol('ITokenService'),
    IProxyService: Symbol('IProxyService'),
    IRouteResolver: Symbol('IRouteResolver'),

    // Routes
    IRoutes: Symbol('IRoutes'),

    // Controllers
    IHealthController: Symbol('IHealthController'),
};