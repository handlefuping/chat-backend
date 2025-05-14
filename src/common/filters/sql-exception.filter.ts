import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { TypeORMError } from 'typeorm';
@Catch(TypeORMError)
export class SqlExceptionFilter<T extends TypeORMError>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.UNPROCESSABLE_ENTITY;

    response.status(status).json({
      code: status,
      message: exception.name,
      path: request.url,
      timestamp: Date.now(),
    });
  }
}
