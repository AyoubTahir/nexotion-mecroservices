declare global {
    namespace Express {
        interface Request {
            authUser?: IAuthPayload;
        }
    }
}

export interface IAuthPayload {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    iat?: number;
}