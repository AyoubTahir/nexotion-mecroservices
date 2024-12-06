import { AuthEmailDto } from "../dtos/auth-email.dto";

export interface IAuthEmailService {
    sendWelcomeEmail(userData: AuthEmailDto.UserRegistration): Promise<void>;
    sendPasswordResetEmail?(userData: AuthEmailDto.PasswordReset): Promise<void>;
}