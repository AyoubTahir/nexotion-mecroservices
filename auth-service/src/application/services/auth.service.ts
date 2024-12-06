import { CONTAINER_TYPES } from "@auth/core/interfaces/constants/container.types";
import { IUserRepository } from "@auth/domain/interfaces/repositories/user-repository.interface";
import { IAuthService } from "@auth/domain/interfaces/services/auth-service.interface";
import { inject, injectable } from "inversify";
import { UserEntity } from "@auth/domain/entities/user.entity";
import { IPasswordService } from "@auth/domain/interfaces/services/password-service.interface";
import { PasswordVO } from "@auth/domain/value-objects/password.vo";
import { AccountLockedError, InvalidCredentialsError, UnauthorizedError, UserAlreadyExistsError } from "@auth/domain/errors/errors";
import { ITokenService } from "@auth/domain/interfaces/services/token-service.interface";


@injectable()
export class AuthService implements IAuthService {

    constructor(
        @inject(CONTAINER_TYPES.IUserRepository) private userRepository: IUserRepository,
        @inject(CONTAINER_TYPES.IPasswordService) private passwordService: IPasswordService,
        @inject(CONTAINER_TYPES.ITokenService) private tokenService: ITokenService
    ){}

    async register(user: UserEntity): Promise<UserEntity> {
        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(user.email.toString());
        if (existingUser) {
          throw new UserAlreadyExistsError();
        }

        // Hash password
        user.setPassword(async (password: PasswordVO) => {
            await this.passwordService.hashPassword(password.toString());
        })

        // Save user
        const savedUser = await this.userRepository.create(user);
    
        // Publish registration event
        //this.eventPublisher.publish(new UserRegisteredEvent(savedUser));
    
        return savedUser;
    }

    async login(email: string, password: string): Promise<{user: UserEntity, token: string}>{
        // Find user by email
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new InvalidCredentialsError();
        }

        // Check if user is active
        if (!user.isActive || user.isLocked()) {
            throw new UnauthorizedError();
        }

        // Verify password
        const isPasswordValid = await this.passwordService.comparePassword(
            password, 
            user.password.toString()
        );

        if (!isPasswordValid) {
            // Increment login attempts
            user.incrementLoginAttempts();
      
            // Lock account after multiple failed attempts
            if (user.hasExceededLoginAttempts()) {
                user.lock(30 * 60 * 1000); // 30 minutes
                await this.userRepository.update(user);
                throw new AccountLockedError();
            }

            await this.userRepository.update(user);
            throw new InvalidCredentialsError();
        }

        // Reset login attempts and add new last login date
        user.newlogin();
        await this.userRepository.update(user);

        // Generate access token
        const token = await this.tokenService.generateAccessToken({
            id: user.id!,
            role: user.role
        });

        // Publish login event
        //this.eventPublisher.publish(new UserLoggedInEvent(user));

        return {
            user: user,
            token
        };
    }

    /*resetPassword(email: string): Promise<void>{

    }
    verifyPasswordResetToken(token: string): Promise<boolean>{

    }*/
}