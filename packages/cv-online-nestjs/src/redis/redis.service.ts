import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;
  private readonly logger = new Logger(RedisService.name);

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL;
    
    if (redisUrl) {
      this.logger.log('🌐 Connecting to Remote Redis...');
      this.client = createClient({ url: redisUrl });
    } else {
      this.logger.log('💻 Connecting to Local Redis...');
      this.client = createClient({
        url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
      });
    }

    this.client.on('error', (err) => this.logger.error(`❌ Redis Client Error: ${err.message}`));
    this.client.on('connect', () => this.logger.log('✅ Redis connected successfully!'));

    await this.client.connect();
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.setEx(key, ttlSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(keys: string | string[]): Promise<void> {
    await this.client.del(keys);
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    return !!(await this.client.expire(key, seconds));
  }
}
