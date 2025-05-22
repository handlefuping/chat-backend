import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Request } from 'express';
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    this.logger.info({
      http: 'request',
      userId: request.session.userInfo?.id,
      url: request.url,
      query: request.query,
      // TODO:
      body: request.body,
    });
    return next.handle().pipe(
      map((data) => {
        const response = {
          code: 200,
          message: '请求成功',
          data,
          timestamp: Date.now(),
        };

        return response;
      }),
    );
  }
}
