import { createClient, RedisClientType } from '@keyv/redis';
import { Injectable } from '@nestjs/common';
import { RedisStore } from 'connect-redis';

@Injectable()
export class RedisService {
  static redisClient: RedisClientType;
  static redisStore: RedisStore;
  async init() {
    if (RedisService.redisClient && RedisService.redisStore) {
      return;
    }
    RedisService.redisClient = createClient({ url: 'redis://localhost:6379' });
    await RedisService.redisClient.connect();
    RedisService.redisStore = new RedisStore({
      client: RedisService.redisClient,
    });
  }
  get store() {
    return RedisService.redisStore;
  }
  get client(): RedisClientType {
    return RedisService.redisClient;
  }
}
