import { AuthEmailDto } from '@notifications/application/dtos/auth-email.dto';
import { IAuthEmailService } from '@notifications/application/interfaces/auth-email.interface';
import { CONTAINER_TYPES } from '@notifications/core/interfaces/constants/container.types';
import { LoggerConfiguration } from '@notifications/core/interfaces/logger/config.interface';
import { ILogger } from '@notifications/core/interfaces/logger/logger.interface';
import { IConsumers } from '@notifications/core/interfaces/messaging/consumers.interface';
import { IMessageBroker } from '@notifications/core/interfaces/messaging/message-broker.interface';
import { inject, injectable } from 'inversify';

@injectable()
export class NewUserRegistrationEmailConsumer implements IConsumers {
  private logger: ILogger;

  constructor(
    @inject(CONTAINER_TYPES.IMessageBroker) private messageBroker: IMessageBroker,
    @inject(CONTAINER_TYPES.IAuthEmailService) private authEmailService: IAuthEmailService,
    @inject(CONTAINER_TYPES.ILogger) loggerFactory: (conf: LoggerConfiguration) => ILogger
  ) {
    this.logger = loggerFactory({ name: 'notificationsNewUserRegistrationEmailConsumer' });
  }

  async startListening(): Promise<void> {
    try {
      // Subscribe to the RabbitMQ exchange/topic
      await this.messageBroker.subscribe(
        'user.registered', // routing key
        async (userData: AuthEmailDto.UserRegistration) => {
            await this.authEmailService.sendWelcomeEmail(userData);
        },
        'topic',        // exchange type
        'auth-exchange' // optional custom exchange name
      )
      this.logger.info('Started listening for user registered events');
    } catch (error: any) {
        this.logger.error('Error starting listening for user registered events:', error);
    }
  }
}