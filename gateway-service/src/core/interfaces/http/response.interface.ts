export interface IResponse {
    status(code: number): this;
    json(body: any): void;
    send(body: any): void;
    setHeader(key: string, value: string): void;
}