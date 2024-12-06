import { CONTAINER_TYPES } from "@auth/core/interfaces/constants/container.types";
import { IRedisRepository } from "@auth/core/interfaces/database/redis-repository.interface";
import { IEncryptionService } from "@auth/core/interfaces/services/encryption-service.interface";
import { InvalidTokenError } from "@auth/domain/errors/errors";
import { ITokenService, TokenPayloadType } from "@auth/domain/interfaces/services/token-service.interface";
import { ConfigService } from "@auth/infrastructure/config/config.service";
import { inject, injectable } from "inversify";

@injectable()
export class TokenService implements ITokenService {

    constructor(
        @inject(CONTAINER_TYPES.IEncryptionService) private encryptionService: IEncryptionService,
        @inject(ConfigService) private configService: ConfigService,
        @inject(CONTAINER_TYPES.IRedisRepository) private redisRepository: IRedisRepository,
    ){}

    async generateAccessToken(payload: TokenPayloadType): Promise<string> {
        const secret = this.configService.get("ACCESS_TOKEN_SECRET")
        
        //token version
        const tokenVersion = await this.redisRepository.increment(`user:${payload.id}:token_version`)

        return this.encryptionService.generateJwtToken({
                ...payload,
                tokenVersion,
            }, 
            secret, 
            {
                expiresIn: this.configService.get("ACCESS_TOKEN_EXPIRY", "15m"),
                issuer: this.configService.get("ACCESS_TOKEN_ISSUER", "AuthService"),
                jwtid: this.encryptionService.generateSecureToken()
        });
    }

    generateRefreshToken(payload: TokenPayloadType): string {
        const secret = this.configService.get("REFRESH_TOKEN_SECRET")
        
        return this.encryptionService.generateJwtToken(payload, secret, {
            expiresIn: this.configService.get("REFRESH_TOKEN_EXPIRY", "30d"),
            issuer: this.configService.get("JWT_TOKEN_ISSUER", "AuthService"),
            jwtid: this.encryptionService.generateSecureToken()
        });
    }

    async verifyToken(token: string): Promise<TokenPayloadType | null> {
        try {
            const secret = this.configService.get("ACCESS_TOKEN_SECRET")
            
            const decoded = this.encryptionService.verifyJwtToken<TokenPayloadType>(token, secret, {
                issuer: this.configService.get("JWT_TOKEN_ISSUER", "AuthService"),
                algorithms: ['HS256'] 
            });

            if (!decoded || !decoded.id) {
                throw new InvalidTokenError();
            }

            const currentVersion = await this.redisRepository.get(
                `user:${decoded.id}:token_version`
            );

            if (currentVersion && decoded.tokenVersion < parseInt(currentVersion)) {
                throw new InvalidTokenError();
            }

            return decoded;
        } catch (error) {
            throw new InvalidTokenError();
        }
    }

    generatePasswordResetToken(email: string): string {
        const secret = this.configService.get("PASSWORD_RESET_TOKEN_SECRET")
        
        return this.encryptionService.generateJwtToken({ email }, secret, {
            expiresIn: this.configService.get("PASSWORD_RESET_TOKEN_EXPIRY", "1h"),
            issuer: this.configService.get("JWT_TOKEN_ISSUER", "AuthService"),
            jwtid: this.encryptionService.generateSecureToken()
        });
    }

    async invalidateUserTokens(userId: string): Promise<void> {
        await this.redisRepository.increment(`user:${userId}:token_version`);
    }
}