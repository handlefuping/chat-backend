import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import generateStore from './service/redisStore';

async function bootstrap() {
  const store = await generateStore();
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'chat-backend',
      store,
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
