import 'reflect-metadata';
import { AuthEmailDto } from "@notifications/application/dtos/auth-email.dto";
import { IAuthEmailService } from "@notifications/application/interfaces/auth-email.interface";
import { ILogger } from "@notifications/core/interfaces/logger/logger.interface";
import { IConsumers } from "@notifications/core/interfaces/messaging/consumers.interface";
import { IMessageBroker } from "@notifications/core/interfaces/messaging/message-broker.interface";
import { NewUserRegistrationEmailConsumer } from "@notifications/infrastructure/messaging/consumers/new-user-registration-email.consumer";

describe('NewUserRegistrationEmailConsumer', () => {
    let consumer: IConsumers;
    let mockMessageBroker: jest.Mocked<IMessageBroker>;
    let mockAuthEmailService: jest.Mocked<IAuthEmailService>;
    let mockLogger: jest.Mocked<ILogger>;
    let mockLoggerFactory: jest.Mock;
  
    const mockUserData: AuthEmailDto.UserRegistration = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe'
    };
  
    beforeEach(() => {
      // Mock Message Broker
      mockMessageBroker = {
        subscribe: jest.fn()
      } as any;
  
      // Mock Auth Email Service
      mockAuthEmailService = {
        sendWelcomeEmail: jest.fn()
      } as any;
  
      // Mock Logger
      mockLogger = {
        info: jest.fn(),
        error: jest.fn()
      } as any;
  
      // Mock Logger Factory
      mockLoggerFactory = jest.fn().mockReturnValue(mockLogger);
  
      // Instantiate Consumer
      consumer = new NewUserRegistrationEmailConsumer(
        mockMessageBroker,
        mockAuthEmailService,
        mockLoggerFactory
      );
    });
  
    describe('startListening', () => {
      it('should subscribe to user registered events', async () => {
        // Arrange
        mockMessageBroker.subscribe.mockResolvedValue(undefined);
        mockAuthEmailService.sendWelcomeEmail.mockResolvedValue(undefined);
  
        // Act
        await consumer.startListening();
  
        // Assert
        expect(mockMessageBroker.subscribe).toHaveBeenCalledWith(
          'user.registered',
          expect.any(Function),
          'topic',
          'auth-exchange'
        );
  
        expect(mockLogger.info).toHaveBeenCalledWith(
          'Started listening for user registered events'
        );
      });
  
      it('should handle error when subscribing fails', async () => {
        // Arrange
        const mockError = new Error('Subscription failed');
        mockMessageBroker.subscribe.mockRejectedValue(mockError);
  
        // Act
        await consumer.startListening();
  
        // Assert
        expect(mockMessageBroker.subscribe).toHaveBeenCalledWith(
          'user.registered',
          expect.any(Function),
          'topic',
          'auth-exchange'
        );
  
        expect(mockLogger.error).toHaveBeenCalledWith(
          'Error starting listening for user registered events:',
          mockError
        );
      });
  
      it('should send welcome email when user registered event is received', async () => {
        // Arrange
        let eventHandler: any;
        mockMessageBroker.subscribe.mockImplementation((
          _routingKey, 
          handler, 
          _type, 
          _exchange
        ) => {
          eventHandler = handler;
          return Promise.resolve();
        });
  
        mockAuthEmailService.sendWelcomeEmail.mockResolvedValue(undefined);
  
        // Act
        await consumer.startListening();
        
        // Trigger the event handler
        await eventHandler(mockUserData);
  
        // Assert
        expect(mockAuthEmailService.sendWelcomeEmail).toHaveBeenCalledWith(mockUserData);
      });
  
      it('should handle error when sending welcome email fails', async () => {
        // Arrange
        let eventHandler: any;
        mockMessageBroker.subscribe.mockImplementation((
          _routingKey, 
          handler, 
          _type, 
          _exchange
        ) => {
          eventHandler = handler;
          return Promise.resolve();
        });
  
        const mockError = new Error('Email sending failed');
        mockAuthEmailService.sendWelcomeEmail.mockRejectedValue(mockError);
  
        // Act
        await consumer.startListening();
        
        // Trigger the event handler and catch potential error
        await expect(eventHandler(mockUserData)).rejects.toThrow('Email sending failed');
  
        // Assert
        expect(mockAuthEmailService.sendWelcomeEmail).toHaveBeenCalledWith(mockUserData);
      });
    });
});