export interface IHttpResponse {
    status: (code: number) => IHttpResponse;
    json: (body: any) => void;
};
  
export class ResponseHandler {
    static success(response: IHttpResponse, message: string, data?: any, statusCode = 200) {
        response.status(statusCode).json({
            status: 'success',
            message,
            data,
        });
    }
  
    static error(
      response: IHttpResponse,
      error: Error,
      statusCode = 500,
      metadata?: Record<string, any>
    ) {
      response.status(statusCode).json({
        status: 'error',
        message: error.message,
        code: (error as any).code || 'INTERNAL_SERVER_ERROR',
        metadata,
      });
    }
}
  