import { Injectable } from '@nestjs/common';
import winston, { createLogger, transports, format } from 'winston';
const { combine, timestamp, json, simple } = format;

@Injectable()
export class LoggerService {
  logger: winston.Logger;
  constructor() {
    this.logger = createLogger({
      format: combine(timestamp(), json()),
      transports: [
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' }),
      ],
    });
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new transports.Console({
          format: simple(),
        }),
      );
    }
  }
  _stringify(message: unknown) {
    if (typeof message === 'string') {
      return message;
    } else {
      try {
        return JSON.stringify(message);
      } catch (e) {
        this.error((e as Error).message);
      }
    }
  }
  _log(message: unknown, level: string = 'info') {
    const msg = this._stringify(message);
    if (msg) {
      this.logger.log({ level, message: msg });
    }
  }
  log(message: unknown) {
    this._log(message);
  }
  error(message: unknown) {
    this._log(message, 'error');
  }
  warn(message: string) {
    this._log(message, 'warn');
  }
}
