import { IRequest } from "@notifications/core/interfaces/http/request.interface";
import { Request } from "express";
import { injectable } from "inversify";

@injectable()
export class ExpressRequest implements IRequest {
  constructor(private req: Request) {}

  getParams(): Record<string, any> {
    return this.req.params;
  }

  getBody(): any {
    return this.req.body;
  }

  getHeaders(): Record<string, string> {
    return this.req.headers as Record<string, string>;
  }

  getQuery(): Record<string, any> {
    return this.req.query;
  }
}