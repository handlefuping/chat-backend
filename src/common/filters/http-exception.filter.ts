import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from 'src/service/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException>
  implements ExceptionFilter
{
  constructor(private loggerService: LoggerService) {}
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const responseData = {
      code: status,
      message: exception.getResponse(),
      path: request.url,
      timestamp: Date.now(),
    };
    response.status(status).json(responseData);
    this.loggerService.error(responseData);
  }
}
