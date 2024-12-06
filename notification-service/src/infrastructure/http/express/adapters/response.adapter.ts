import { IResponse } from "@notifications/core/interfaces/http/response.interface";
import { Response } from "express";
import { injectable } from "inversify";

@injectable()
export class ExpressResponse implements IResponse {
  constructor(private res: Response) {}

  status(code: number): this {
    this.res.status(code);
    return this;
  }

  json(body: any): void {
    this.res.json(body);
  }

  send(body: any): void {
    this.res.send(body);
  }

  setHeader(key: string, value: string): void {
    this.res.setHeader(key, value);
  }
}