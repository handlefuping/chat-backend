import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { RedisService } from './service/redis.service';
import { LoggerService } from './service/logger.service';

async function bootstrap() {
  const redis = new RedisService();
  await redis.init();
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(LoggerService));
  app.use(
    session({
      secret: 'chat-backend',
      store: redis.store,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 600000,
      },
      rolling: false,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
