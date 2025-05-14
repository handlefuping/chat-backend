import { createClient } from '@keyv/redis';
import { RedisStore } from 'connect-redis';

let redisClient: null | ReturnType<typeof createClient> = null;

const generateStore = async () => {
  redisClient = createClient({ url: 'redis://localhost:6379' });
  await redisClient.connect();
  return new RedisStore({ client: redisClient });
};
export { redisClient };

export default generateStore;
