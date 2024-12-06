import { IRedisRepository } from '@auth/core/interfaces/database/redis-repository.interface';
import { inject } from 'inversify';
import { createClient, RedisClientType } from 'redis';
import { ConfigService } from '../config/config.service';

export class RedisRepository implements IRedisRepository {
  private client!: RedisClientType;

  constructor(
    @inject(ConfigService) private configService: ConfigService
  ) {}

  async connect(): Promise<void> {
    if (this.client.isOpen) return;
    this.client = createClient({
        socket: {
          host: this.configService.get("REDIS_HOST", "localhost"),
          port: this.configService.getNumber("REDIS_PORT", 6379)
        },
        password: this.configService.get("REDIS_PASSWORD")
    });

    await this.client.connect()
  
    this.client.on('error', (err) => {
        console.error('Redis Client Error', err);
    });
    
    this.client.on('connect', () => {
        console.log('Connected to Redis');
    });
  }

  async set(
    key: string, 
    value: string | object, 
    expirationInSeconds?: number
  ): Promise<void> {
    await this.connect();
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
    
    if (expirationInSeconds) {
      await this.client.set(key, stringValue, { EX: expirationInSeconds });
    } else {
      await this.client.set(key, stringValue);
    }
  }

  async get<T = string>(key: string): Promise<T | null> {
    await this.connect();
    const value = await this.client.get(key);
    
    if (!value) return null;
    
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }

  async delete(key: string): Promise<void> {
    await this.connect();
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    await this.connect();
    const result = await this.client.exists(key);
    return result === 1;
  }

  async increment(key: string): Promise<number> {
    await this.connect();
    return this.client.incr(key);
  }

  async setNX(key: string, value: string | object): Promise<boolean> {
    await this.connect();
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
    const result = await this.client.set(key, stringValue, { NX: true });
    return result === null ? false : true;
  }

  async addToSet(key: string, member: string): Promise<void> {
    await this.connect();
    await this.client.sAdd(key, member);
  }

  async isInSet(key: string, member: string): Promise<boolean> {
    await this.connect();
    const result = await this.client.sIsMember(key, member);
    return result === 1;
  }

  async close(): Promise<void> {
    await this.client.quit();
  }
}