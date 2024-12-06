export class OrmAdapterError extends Error {
    originalError?: Error;

    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = 'OrmAdapterError';
        this.originalError = originalError;
    }
}