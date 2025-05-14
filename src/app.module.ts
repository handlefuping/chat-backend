import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/entities/user.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { redisClient } from './service/redisStore';
import KeyvRedis, { Keyv, RedisClientType } from '@keyv/redis';
import { CoreModule } from './modules/core.module';
import { SqlExceptionFilter } from './common/filters/sql-exception.filter';
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => {
        return {
          stores: [new Keyv(new KeyvRedis(redisClient as RedisClientType))],
        };
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root123456',
      database: 'chat',
      entities: [User],
      synchronize: true,
    }),
    CoreModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SqlExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },

    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          transform: true,
        }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
