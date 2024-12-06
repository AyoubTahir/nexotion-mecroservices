import { IHttpServer } from "./server.interface";

export interface IMiddlewares {
    register(httpServer: IHttpServer): void;
}