import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import {
  MODULE_OPTIONS_TOKEN,
  type RedisModuleOptions,
} from './redis.module-definition';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: RedisModuleOptions,
  ) {
    this.client = new Redis(this.options.redisUrl, {
      password: this.options.redisPassword,
      lazyConnect: false,
      retryStrategy: (times: number) => {
        if (times > 3) {
          this.logger.error('Redis connection failed after 3 retries', {
            context: RedisService.name,
          });
          return null; // Stop retrying
        }
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.client.on('connect', () => {
      this.logger.log('Redis client connected', {
        context: RedisService.name,
      });
    });

    this.client.on('error', (error: Error) => {
      this.logger.error(`Redis client error: ${error.message}`, {
        context: RedisService.name,
        error,
      });
    });

    this.client.on('close', () => {
      this.logger.warn('Redis connection closed', {
        context: RedisService.name,
      });
    });
  }

  async onModuleDestroy() {
    await this.client.quit();
    this.logger.log('Redis client disconnected', {
      context: RedisService.name,
    });
  }

  /**
   * Get a value from Redis by key
   */
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  /**
   * Set a value in Redis with optional TTL
   */
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.setex(key, ttlSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  /**
   * Set a value with expiration (alias for set with TTL)
   */
  async setex(key: string, ttlSeconds: number, value: string): Promise<void> {
    await this.client.setex(key, ttlSeconds, value);
  }

  /**
   * Delete a key from Redis
   */
  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  /**
   * Check if Redis is connected and healthy
   */
  async ping(): Promise<boolean> {
    try {
      const result = await this.client.ping();
      return result === 'PONG';
    } catch {
      return false;
    }
  }

  /**
   * Get the underlying Redis client for advanced operations
   */
  getClient(): Redis {
    return this.client;
  }
}
