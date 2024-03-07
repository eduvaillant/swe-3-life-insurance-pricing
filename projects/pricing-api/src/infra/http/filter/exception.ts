import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import {
  CoverageAlreadyExistsError,
  CoverageNotFoundError,
  OccupationNotFoundError,
} from '@application/error';
import {
  InvalidAgeError,
  InvalidCapitalError,
  InvalidPremiumError,
} from '@domain/error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    console.log(exception);
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    let httpStatus: number;
    let message: string;
    if (exception instanceof HttpException) {
      message = exception.getResponse()['message'];
      httpStatus = exception.getStatus();
    } else if (exception instanceof CoverageAlreadyExistsError) {
      httpStatus = HttpStatus.CONFLICT;
      message = exception['message'];
    } else if (
      exception instanceof CoverageNotFoundError ||
      exception instanceof OccupationNotFoundError
    ) {
      httpStatus = HttpStatus.NOT_FOUND;
      message = exception['message'];
    } else if (
      exception instanceof InvalidPremiumError ||
      exception instanceof InvalidCapitalError ||
      exception instanceof InvalidAgeError
    ) {
      httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
      message = exception['message'];
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal Server Error';
    }
    httpAdapter.reply(
      ctx.getResponse(),
      { error: { code: httpStatus, message } },
      httpStatus,
    );
  }
}
