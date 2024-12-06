import { IHttpResponse, ResponseHandler } from "./http-response";

export interface IError {
    message: string;
    statusCode: number;
    code: string;
    metadata?: Record<string, any>;
}

export abstract class BaseError extends Error {
    constructor(
      public readonly message: string,
      public readonly statusCode: number,
      public readonly code: string,
      public readonly metadata?: Record<string, any>
    ) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
    }

    serialize(): IError {
        return {
          message: this.message,
          statusCode: this.statusCode,
          code: this.code,
          ...(this.metadata && { metadata: this.metadata }),
        };
    }
}

export class ServerError extends BaseError {
    constructor(message: string, statusCode = 500, metadata?: Record<string, any>) {
        super(message, statusCode, 'INTERNAL_SERVER_ERROR', metadata);
    }
}

export class BadRequestError extends BaseError {
    constructor(message: string, metadata?: Record<string, any>) {
        super(message, 400, 'BAD_REQUEST', metadata);
    }
}

export class UnauthorizedError extends BaseError {
    constructor(message: string, metadata?: Record<string, any>) {
        super(message, 401, 'UNAUTHORIZED', metadata);
    }
}

export class ForbiddenError extends BaseError {
    constructor(message: string, metadata?: Record<string, any>) {
        super(message, 403, 'FORBIDDEN', metadata);
    }
}

export class NotFoundError extends BaseError {
    constructor(message: string, metadata?: Record<string, any>) {
        super(message, 404, 'NOT_FOUND', metadata);
    }
}

export class ConflictError extends BaseError {
    constructor(message: string, metadata?: Record<string, any>) {
        super(message, 409, 'CONFLICT', metadata);
    }
}

export const handleError = (res: IHttpResponse, err: Error, env: string = 'production') => {
    if (err instanceof BaseError) {
      const serializedError = err.serialize();
      ResponseHandler.error(res, err, serializedError.statusCode, serializedError.metadata)
    }
  
    // Handle unexpected errors
    console.error('Unexpected error:', err);
    ResponseHandler.error(res, err, 500, {
        name: err.name,
        ...(env === 'development' && { stack: err.stack }),
    })
};