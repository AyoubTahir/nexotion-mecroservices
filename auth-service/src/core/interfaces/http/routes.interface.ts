import { IHttpServer } from "./server.interface";

export interface IRoutes {
    register(httpServer: IHttpServer): void;
}