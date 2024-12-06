import express, { Express, Request, Response } from 'express';
import { IHttpServer } from "@notifications/core/interfaces/http/server.interface";
import { inject, injectable } from "inversify";
import { ILogger } from '@notifications/core/interfaces/logger/logger.interface';
import { CONTAINER_TYPES } from '@notifications/core/interfaces/constants/container.types';
import { IRequest } from '@notifications/core/interfaces/http/request.interface';
import { IResponse } from '@notifications/core/interfaces/http/response.interface';
import { ExpressRequest } from './adapters/request.adapter';
import { ExpressResponse } from './adapters/response.adapter';
import { LoggerConfiguration } from '@notifications/core/interfaces/logger/config.interface';

@injectable()
export class ExpressServer implements IHttpServer {
  private app: Express;
  private logger: ILogger

  constructor(
    @inject(CONTAINER_TYPES.ILogger) loggerFactory: (conf: LoggerConfiguration) => ILogger
  ) {
    this.logger = loggerFactory({ name: "notificationExpressServer" });
    this.app = express();
    this.configureMiddlewares();
  }

  private configureMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  registerRoute(
    method: 'get' | 'post' | 'put' | 'delete' | 'patch', 
    path: string, 
    handler: (req: IRequest, res: IResponse) => Promise<void>
  ): void {
    this.app[method](path, async (req: Request, res: Response/*, next: NextFunction*/) => {
      const wrappedReq = new ExpressRequest(req);
      const wrappedRes = new ExpressResponse(res);

      try {
        await handler(wrappedReq, wrappedRes);
      } catch (error: any) {
        this.logger.error('Route handler error', error);
        wrappedRes.status(500).json({ error: 'Internal Server Error' });
      }
    });
  }

  async start(port: number, host: string = 'localhost'): Promise<void> {
    return new Promise((resolve, reject) => {
      this.app.listen(port, host, () => {
        this.logger.info(`Server running on ${host}:${port}`);
        resolve();
      }).on('error', (error) => {
        this.logger.error('Server start error', error);
        reject(error);
      });
    });
  }

  async stop(): Promise<void> {
    // In Express, server.close() requires a server instance
    this.logger.info('Server stopped');
  }

  getInstance(): any {
    return this.app;
  }
}