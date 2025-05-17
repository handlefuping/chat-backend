import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { LoggerService } from 'src/service/logger.service';
import { Request } from 'express';
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private loggerService: LoggerService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    this.loggerService.log({
      http: 'request',
      userId: request.session.userInfo?.id,
      url: request.url,
      query: request.query,
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
        this.loggerService.log({
          http: 'response',
          userId: request.session.userInfo?.id,
          url: request.url,
          data: response,
        });
        return response;
      }),
    );
  }
}
