import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from 'src/service/logger.service';
import { TypeORMError } from 'typeorm';
@Catch(TypeORMError)
export class SqlExceptionFilter<T extends TypeORMError>
  implements ExceptionFilter
{
  constructor(private loggerService: LoggerService) {}
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.UNPROCESSABLE_ENTITY;
    const responseData = {
      code: status,
      message: exception.name,
      path: request.url,
      timestamp: Date.now(),
    };
    response.status(status).json(responseData);
    this.loggerService.error(responseData);
  }
}
