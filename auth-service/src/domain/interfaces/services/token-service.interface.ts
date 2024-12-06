import { UserRole } from "@auth/domain/entities/user.entity";

export type TokenPayloadType = {
    id: string | number, 
    role: UserRole,
    tokenVersion?: number,
}

export interface ITokenService {
    generateAccessToken(payload: TokenPayloadType): Promise<string>;
    generateRefreshToken(payload: TokenPayloadType): string;
    verifyToken(token: string): Promise<TokenPayloadType | null>;
    generatePasswordResetToken(email: string): string;
}