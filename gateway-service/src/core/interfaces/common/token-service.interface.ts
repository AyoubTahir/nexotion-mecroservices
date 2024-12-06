export interface TokenPayload {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
}

export interface ITokenService {
    generateToken(payload: TokenPayload, expiresIn?: string): string;
    validateToken(token: string): TokenPayload;
    refreshToken(token: string): string;
    generateServiceToken(serviceName: string): string;
}