export interface IRequest {
    getParams(): Record<string, any>;
    getBody(): any;
    getHeaders(): Record<string, string>;
    getQuery(): Record<string, any>;
}