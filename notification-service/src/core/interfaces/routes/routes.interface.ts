import { IHttpServer } from "../http/server.interface";

export interface IRoutes {
    register(httpServer: IHttpServer): void;
}