import { IServiceConfig, MICROSERVICES_CONFIG } from "@gateway/core/constants/microservice.config";
import { IRouteResolver } from "@gateway/core/interfaces/common/route-resolver.interface";

export class RouteResolver implements IRouteResolver {
    resolveRoute(requestPath: string, method: string): IServiceConfig | null {
      for (const [_, serviceConfig] of Object.entries(MICROSERVICES_CONFIG)) {
        const matchedRoute = serviceConfig.routes.find(route => 
          this.matchRoute(requestPath, route.path) && route.method === method
        );
  
        if (matchedRoute) return serviceConfig;
      }
      return null;
    }
  
    private matchRoute(requestPath: string, routePath: string): boolean {
      const requestParts = requestPath.split('/').filter(Boolean);
      const routeParts = routePath.split('/').filter(Boolean);
  
      if (requestParts.length !== routeParts.length) return false;
  
      return routeParts.every((part, index) => 
        part.startsWith(':') || part === requestParts[index]
      );
    }
}