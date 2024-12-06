import { CONTAINER_TYPES } from "@gateway/core/interfaces/constants/container.types";
import { IHttpServer } from "@gateway/core/interfaces/http/server.interface";
import { inject, injectable } from "inversify";
import { IMiddlewares } from "@gateway/core/interfaces/http/middleware.interface";
import { IRequest } from "@gateway/core/interfaces/http/request.interface";
import { IResponse } from "@gateway/core/interfaces/http/response.interface";
import { IProxyService } from "@gateway/core/interfaces/http/proxy-service.interface";
import { MICROSERVICES_CONFIG } from "@gateway/core/constants/microservice.config";
import { IRouteResolver } from "@gateway/core/interfaces/common/route-resolver.interface";

@injectable()
export class ApiGatewayMiddleware implements IMiddlewares {
  constructor(
    @inject(CONTAINER_TYPES.IProxyService) private proxyService: IProxyService,
    @inject(CONTAINER_TYPES.IRouteResolver) private routeResolver: IRouteResolver
  ) {}

  register(httpServer: IHttpServer): void {
    httpServer.registerMiddleware(this.proxyRequest);
  }

  public proxyRequest = async (req: IRequest, res: IResponse, next: Function) => {
    try {
      const serviceConfig = this.routeResolver.resolveRoute(req.getPath(), req.getMethod());
      
      if (!serviceConfig) {
        next(); 
      }

      const response = await this.proxyService.proxyRequest(
        Object.keys(MICROSERVICES_CONFIG).find(
          key => MICROSERVICES_CONFIG[key] === serviceConfig
        ) || '',
        req.getPath(),
        req.getMethod(),
        req.getBody()
      );

      res.status(response.status).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
  }
}