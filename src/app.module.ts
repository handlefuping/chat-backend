import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/entities/user.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisService } from './service/redis.service';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { CoreModule } from './modules/core.module';
import { SqlExceptionFilter } from './common/filters/sql-exception.filter';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
const { combine, timestamp, json } = format;

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const redis = new RedisService();
        await redis.init();
        return {
          stores: [new Keyv(new KeyvRedis(redis.client))],
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
    WinstonModule.forRoot({
      format: combine(timestamp(), json()),
      transports: [
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' }),
      ],
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
export class AppModule {}
