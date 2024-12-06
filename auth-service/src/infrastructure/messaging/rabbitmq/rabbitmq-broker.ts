import { CONTAINER_TYPES } from '@auth/core/interfaces/constants/container.types';
import { LoggerConfiguration } from '@auth/core/interfaces/logger/config.interface';
import { ILogger } from '@auth/core/interfaces/logger/logger.interface';
import { IMessageBroker } from '@auth/core/interfaces/messaging/message-broker.interface';
import { ConfigService } from '@auth/infrastructure/config/config.service';
import amqp from 'amqplib';
import { inject, injectable } from 'inversify';

@injectable()
export class RabbitMQBroker implements IMessageBroker {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private logger: ILogger;

  constructor(
    @inject(ConfigService) private config: ConfigService,
    @inject(CONTAINER_TYPES.ILogger) loggerFactory: (conf: LoggerConfiguration) => ILogger
  ) {
    this.logger = loggerFactory({ name: "authRabbitMQBroker" });
  }

  async connect(): Promise<void> {
    const host = this.config.get('RABBITMQ_HOST', 'localhost');
    const port = this.config.getNumber('RABBITMQ_PORT', 5672);
    const username = this.config.get('RABBITMQ_USERNAME', 'nexotion');
    const password = this.config.get('RABBITMQ_PASSWORD', 'nexotionpassword');
    const connectionString = `amqp://${username}:${password}@${host}:${port}`;
    
    try
    {
      this.connection = await amqp.connect(connectionString);
      this.channel = await this.connection.createChannel();
      this.logger.info(`Connected to RabbitMQ at ${connectionString}`);
    }catch(error: any){
      this.logger.error(`Failed to connect to RabbitMQ: ${error.message}`);
      throw error;
    }
  }

  async publish(
    topic: string, 
    message: any, 
    exchangeType: 'direct' | 'topic' | 'fanout' = 'direct',
    exchangeName?: string
  ): Promise<void> {
    if (!this.channel) {
      await this.connect();
    }
    
    // Use provided exchange name or default to topic name
    const exchange = exchangeName || topic;

    // Assert exchange
    await this.channel!.assertExchange(exchange, exchangeType, { durable: true });

    // Convert message to buffer
    const content = Buffer.from(JSON.stringify(message));

    // Publish to exchange
    this.channel!.publish(exchange, topic, content, { 
      persistent: true 
    });
  }

  async subscribe(
    topic: string, 
    handler: (message: any) => Promise<void>, 
    exchangeType: 'direct' | 'topic' | 'fanout' = 'direct',
    exchangeName?: string
  ): Promise<void> {
    if (!this.channel) {
      await this.connect();
    }
    
    // Use provided exchange name or default to topic name
    const exchange = exchangeName || topic;

    // Assert exchange
    await this.channel!.assertExchange(exchange, exchangeType, { durable: true, autoDelete: false });

    // Create a unique queue for this subscriber
    const { queue } = await this.channel!.assertQueue('', { 
      exclusive: true 
    });

    // Bind queue to exchange
    await this.channel!.bindQueue(queue, exchange, topic);

    // Consume messages from the queue
    await this.channel!.consume(queue, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          await handler(content);
          this.channel!.ack(msg);
        } catch (error) {
          console.error('Error processing message:', error);
          // Reject the message, but do not requeue
          this.channel!.nack(msg, false, false);
        }
      }
    });
  }

  async unsubscribe(topic: string): Promise<void> {
    if (this.channel) {
      // In RabbitMQ, unsubscribing typically means cancelling the consumer
      await this.channel.cancel(topic);
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
      this.channel = null;
    }
  }
}