import { Kafka, Producer, Consumer, KafkaConfig, ProducerRecord } from 'kafkajs';
import { inject, injectable } from 'inversify';
import { CONTAINER_TYPES } from '@auth/core/interfaces/constants/container.types';
import { LoggerConfiguration } from '@auth/core/interfaces/logger/config.interface';
import { ILogger } from '@auth/core/interfaces/logger/logger.interface';
import { IMessageBroker } from '@auth/core/interfaces/messaging/message-broker.interface';
import { ConfigService } from '@auth/infrastructure/config/config.service';

@injectable()
export class KafkaBroker implements IMessageBroker {
  private kafka: Kafka | null = null;
  private producer: Producer | null = null;
  private consumer: Consumer | null = null;
  private logger: ILogger;
  private consumerTopics: Map<string, (message: any) => Promise<void>> = new Map();

  constructor(
    @inject(ConfigService) private config: ConfigService,
    @inject(CONTAINER_TYPES.ILogger) loggerFactory: (conf: LoggerConfiguration) => ILogger
  ) {
    this.logger = loggerFactory({ name: "authKafkaService" });
  }

  async connect(): Promise<void> {
    const brokers = [this.config.get('KAFKA_BROKERS', 'localhost:9092')];
    const clientId = this.config.get('KAFKA_CLIENT_ID', 'notification-service');
    const groupId = this.config.get('KAFKA_GROUP_ID', 'notification-consumer-group');

    const kafkaConfig: KafkaConfig = {
      clientId,
      brokers,
    };

    try {
      this.kafka = new Kafka(kafkaConfig);
      this.producer = this.kafka.producer();
      this.consumer = this.kafka.consumer({ 
        groupId,
        allowAutoTopicCreation: true 
      });

      await this.producer.connect();
      await this.consumer.connect();

      this.logger.info(`Connected to Kafka brokers: ${brokers.join(', ')}`);
    } catch (error: any) {
      this.logger.error(`Failed to connect to Kafka: ${error.message}`);
      throw error;
    }
  }

  async publish(
    topic: string, 
    message: any, 
    _exchangeType: 'direct' | 'topic' | 'fanout' = 'direct',
    _exchangeName?: string
  ): Promise<void> {
    if (!this.producer) {
      await this.connect();
    }

    // In Kafka, the exchangeName is effectively ignored as topics are the primary routing mechanism
    const producerRecord: ProducerRecord = {
      topic,
      messages: [{
        value: JSON.stringify(message)
      }]
    };

    try {
      await this.producer!.send(producerRecord);
    } catch (error: any) {
      this.logger.error(`Failed to publish message to topic ${topic}: ${error.message}`);
      throw error;
    }
  }

  async subscribe(
    topic: string, 
    handler: (message: any) => Promise<void>, 
    _exchangeType: 'direct' | 'topic' | 'fanout' = 'direct',
    _exchangeName?: string
  ): Promise<void> {
    if (!this.consumer) {
      await this.connect();
    }

    // Store the handler for potential future reference
    this.consumerTopics.set(topic, handler);

    // Subscribe to the topic
    await this.consumer!.subscribe({ 
      topic,
      fromBeginning: false 
    });

    // Run the consumer
    await this.consumer!.run({
      eachMessage: async ({ topic, message }) => {
        try {
          if (message.value) {
            const content = JSON.parse(message.value.toString());
            await handler(content);
          }
        } catch (error) {
          this.logger.error(`Error processing message from topic ${topic}: ${error}`);
        }
      }
    });
  }

  async unsubscribe(topic: string): Promise<void> {
    if (this.consumer) {
      // Remove the stored handler
      this.consumerTopics.delete(topic);

      // In Kafka, unsubscribing is typically done by stopping the consumer
      try {
        await this.consumer.stop();
        await this.consumer.disconnect();
        this.consumer = null;
      } catch (error) {
        this.logger.error(`Error unsubscribing from topic ${topic}: ${error}`);
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.producer) {
      await this.producer.disconnect();
      this.producer = null;
    }

    if (this.consumer) {
      await this.consumer.stop();
      await this.consumer.disconnect();
      this.consumer = null;
    }

    this.kafka = null;
    this.consumerTopics.clear();
  }
}