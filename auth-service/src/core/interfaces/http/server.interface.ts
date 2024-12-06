import { IRequest } from "./request.interface";
import { IResponse } from "./response.interface";

export interface IHttpServer {

    registerRoute(
        method: 'get' | 'post' | 'put' | 'delete' | 'patch',
        path: string,
        handler: (req: IRequest, res: IResponse) => Promise<void>
    ): void;

    registerMiddleware(middleware: (req: IRequest, res: IResponse, next: Function) => void): void

    start(port: number, host?: string): Promise<void>;

    stop(): Promise<void>;

    getInstance(): any;
}