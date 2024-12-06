export interface IServiceConfig {
  baseUrl: string;
  routes: IRouteConfig[];
}

export interface IRouteConfig {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

export const MICROSERVICES_CONFIG: Record<string, IServiceConfig> = {
    authService: {
      baseUrl: 'http://localhost:3002',
      routes: [
        //{ path: '/users/:id', method: 'GET' },
        { path: '/register', method: 'POST' },
        { path: '/login', method: 'POST' }
      ]
    },
    // Add more service configurations
};