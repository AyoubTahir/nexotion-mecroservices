import { IRequest } from "../http/request.interface";
import { IResponse } from "../http/response.interface";

export interface IHealthController {
    health(req: IRequest, res: IResponse): Promise<void>;
}