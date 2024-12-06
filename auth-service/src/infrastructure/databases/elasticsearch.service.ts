import { Client } from '@elastic/elasticsearch';
import { CONTAINER_TYPES } from '@auth/core/interfaces/constants/container.types';
import { IElasticsearchService } from "@auth/core/interfaces/database/elasticsearch-service.interface";
import { LoggerConfiguration } from '@auth/core/interfaces/logger/config.interface';
import { ILogger } from '@auth/core/interfaces/logger/logger.interface';
import { inject, injectable } from 'inversify';
import { ConfigService } from '../config/config.service';

@injectable()
export class ElasticsearchService implements IElasticsearchService {
    private client!: Client;
    private logger: ILogger

    constructor(
      @inject(ConfigService) private config: ConfigService,
      @inject(CONTAINER_TYPES.ILogger) loggerFactory: (conf: LoggerConfiguration) => ILogger
    ) {
        this.logger = loggerFactory({ name: "authElasticsearchService" });
    }
  
    connect(): Promise<void> {
      try {
        this.client = new Client({
          node: this.config.get('ELASTICSEARCH_NODE', 'http://localhost:9200'),
          /*auth: this.config.username && this.config.password 
            ? { 
                username: this.config.username, 
                password: this.config.password 
              }
            : undefined*/
        });
  
        return this.checkHealth().then(isHealthy => {
          if (!isHealthy) {
            throw new Error('Elasticsearch cluster is not healthy');
          }
          this.logger.info('Connected to Elasticsearch cluster');
        });
      } catch (error: any) {
        this.logger.error('Elasticsearch connection failed', error);
        throw error;
      }
    }
  
    async checkHealth(): Promise<boolean> {
      try {
        const health = await this.client.cluster.health({});
        const isHealthy = health.status !== 'red';
        
        if (!isHealthy) {
          this.logger.warn('Elasticsearch cluster is in an unhealthy state');
        }
        else{
            this.logger.info('Elasticsearch cluster is healthy');
        }
  
        return isHealthy;
      } catch (error: any) {
        this.logger.error('Failed to check Elasticsearch health', error);
        return false;
      }
    }
  
    getClient(): Client {
      if (!this.client) {
        throw new Error('Elasticsearch client not initialized');
      }
      return this.client;
    }
}