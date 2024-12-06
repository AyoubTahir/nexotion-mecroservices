import 'reflect-metadata';
import { AuthEmailDto } from "@notifications/application/dtos/auth-email.dto";
import { AuthEmailService } from "@notifications/application/services/auth-email.service";
import { IEmailProvider } from "@notifications/core/interfaces/emails/email.interface";
import { ILogger } from "@notifications/core/interfaces/logger/logger.interface";

describe('AuthEmailService', () => {
    let authEmailService: AuthEmailService;
    let mockEmailProvider: jest.Mocked<IEmailProvider>;
    let mockLoggerFactory: jest.Mock;
    let mockLogger: jest.Mocked<ILogger>;
  
    const mockUserRegistrationData: AuthEmailDto.UserRegistration = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe'
    };
  
    const mockPasswordResetData: AuthEmailDto.PasswordReset = {
      email: 'reset@example.com',
      resetToken: 'abc123'
    };
  
    beforeEach(() => {
      // Mock Email Provider
      mockEmailProvider = {
        send: jest.fn()
      } as any;
  
      // Mock Logger
      mockLogger = {
        error: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn()
      } as any;
  
      // Mock Logger Factory
      mockLoggerFactory = jest.fn().mockReturnValue(mockLogger);
  
      // Create service instance
      authEmailService = new AuthEmailService(
        mockEmailProvider,
        mockLoggerFactory
      );
    });
  
    describe('sendWelcomeEmail', () => {
      it('should successfully send welcome email', async () => {
        // Arrange
        mockEmailProvider.send.mockResolvedValue(undefined);
  
        // Act
        await authEmailService.sendWelcomeEmail(mockUserRegistrationData);
  
        // Assert
        expect(mockEmailProvider.send).toHaveBeenCalledWith({
          to: mockUserRegistrationData.email,
          templateName: 'register',
          context: {
            firstName: mockUserRegistrationData.firstName,
            lastName: mockUserRegistrationData.lastName
          }
        });
      });
  
      it('should log error and rethrow when email sending fails', async () => {
        // Arrange
        const mockError = new Error('Email send failed');
        mockEmailProvider.send.mockRejectedValue(mockError);
  
        // Act & Assert
        await expect(
          authEmailService.sendWelcomeEmail(mockUserRegistrationData)
        ).rejects.toThrow('Email send failed');
  
        expect(mockLogger.error).toHaveBeenCalledWith(
          'Failed to send welcome email', 
          {
            email: mockUserRegistrationData.email,
            error: mockError.message
          }
        );
      });
    });
  
    describe('sendPasswordResetEmail', () => {
      it('should successfully send password reset email', async () => {
        // Arrange
        mockEmailProvider.send.mockResolvedValue(undefined);
  
        // Act
        await authEmailService.sendPasswordResetEmail(mockPasswordResetData);
  
        // Assert
        expect(mockEmailProvider.send).toHaveBeenCalledWith({
          to: mockPasswordResetData.email,
          templateName: 'password-reset',
          context: {
            resetToken: mockPasswordResetData.resetToken
          },
          subject: 'Password Reset Request'
        });
      });
  
      it('should log error and rethrow when password reset email fails', async () => {
        // Arrange
        const mockError = new Error('Password reset email failed');
        mockEmailProvider.send.mockRejectedValue(mockError);
  
        // Act & Assert
        await expect(
          authEmailService.sendPasswordResetEmail(mockPasswordResetData)
        ).rejects.toThrow('Password reset email failed');
  
        expect(mockLogger.error).toHaveBeenCalledWith(
          'Failed to send password reset email', 
          {
            email: mockPasswordResetData.email,
            error: mockError.message
          }
        );
      });
    });
  
    it('should create logger with correct configuration', () => {
      // The constructor calls the logger factory, so we can check it was called correctly
      expect(mockLoggerFactory).toHaveBeenCalledWith({ 
        name: 'notificationsAuthEmailService' 
      });
    });
  });