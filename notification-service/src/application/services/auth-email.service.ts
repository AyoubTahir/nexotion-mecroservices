import { inject, injectable } from "inversify";
import { IAuthEmailService } from "../interfaces/auth-email.interface";
import { ILogger } from "@notifications/core/interfaces/logger/logger.interface";
import { CONTAINER_TYPES } from "@notifications/core/interfaces/constants/container.types";
import { LoggerConfiguration } from "@notifications/core/interfaces/logger/config.interface";
import { IEmailProvider } from "@notifications/core/interfaces/emails/email.interface";
import { AuthEmailDto } from "../dtos/auth-email.dto";

@injectable()
export class AuthEmailService implements IAuthEmailService {
  private logger: ILogger;

  constructor(
    @inject(CONTAINER_TYPES.IEmailProvider) private emailProvider: IEmailProvider,
    @inject(CONTAINER_TYPES.ILogger) loggerFactory: (conf: LoggerConfiguration) => ILogger
  ) {
    this.logger = loggerFactory({ name: 'notificationsAuthEmailService' });
  }

  async sendWelcomeEmail(userData: AuthEmailDto.UserRegistration): Promise<void> {
    try {
      await this.emailProvider.send({
        to: userData.email,
        templateName: 'register',
        context: {
          firstName: userData.firstName,
          lastName: userData.lastName
        }
      });

    } catch (error) {
      this.logger.error('Failed to send welcome email', { 
        email: userData.email,
        error: error instanceof Error ? error.message : error
      });
      throw error;
    }
  }

  async sendPasswordResetEmail(userData: AuthEmailDto.PasswordReset): Promise<void> {
    try {
      await this.emailProvider.send({
        to: userData.email,
        templateName: 'password-reset',
        context: {
          resetToken: userData.resetToken
        },
        subject: 'Password Reset Request'
      });
    } catch (error) {
      this.logger.error('Failed to send password reset email', { 
        email: userData.email,
        error: error instanceof Error ? error.message : error
      });
      throw error;
    }
  }
}