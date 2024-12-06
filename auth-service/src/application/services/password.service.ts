import { CONTAINER_TYPES } from "@auth/core/interfaces/constants/container.types";
import { IEncryptionService } from "@auth/core/interfaces/services/encryption-service.interface";
import { IPasswordService } from "@auth/domain/interfaces/services/password-service.interface";
import { ConfigService } from "@auth/infrastructure/config/config.service";
import { inject, injectable } from "inversify";

@injectable()
export class PasswordService implements IPasswordService {

    constructor(
        @inject(CONTAINER_TYPES.IEncryptionService) private encryptionService: IEncryptionService,
        @inject(ConfigService) private configService: ConfigService,
    ){}

    async hashPassword(password: string): Promise<string> {
        const salt =  this.configService.getNumber("PASSWORD_HASH_SALT", 10);
        return await this.encryptionService.hash(password, salt);
    }

    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await this.encryptionService.compareHash(password, hashedPassword);
    }
}