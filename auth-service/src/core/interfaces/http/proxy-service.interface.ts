export interface IProxyService {
    proxyRequest(
      serviceName: string, 
      route: string, 
      method: 'GET' | 'POST' | 'PUT' | 'DELETE', 
      data?: any
    ): Promise<any>;
}