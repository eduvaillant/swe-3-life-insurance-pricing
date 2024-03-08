import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
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
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    let httpStatus: number;
    let message: string;
    let code: string;
    if (exception instanceof BadRequestException) {
      const rawMessage = exception.getResponse()['message'];
      message =
        rawMessage instanceof Array ? rawMessage.join(', ') : rawMessage;
      httpStatus = exception.getStatus();
      code = 'BAD_REQUEST';
    } else if (exception instanceof UnauthorizedException) {
      message = exception.getResponse()['message'];
      httpStatus = exception.getStatus();
      code = 'UNAUTHORIZED';
    } else if (exception instanceof ForbiddenException) {
      message = exception.getResponse()['message'];
      httpStatus = exception.getStatus();
      code = 'FORBIDDEN';
    } else if (exception instanceof CoverageAlreadyExistsError) {
      httpStatus = HttpStatus.CONFLICT;
      message = exception['message'];
      code = 'CONFLICT';
    } else if (
      exception instanceof CoverageNotFoundError ||
      exception instanceof OccupationNotFoundError
    ) {
      httpStatus = HttpStatus.NOT_FOUND;
      message = exception['message'];
      code = 'NOT_FOUND';
    } else if (
      exception instanceof InvalidPremiumError ||
      exception instanceof InvalidCapitalError ||
      exception instanceof InvalidAgeError
    ) {
      httpStatus = HttpStatus.BAD_REQUEST;
      message = exception['message'];
      code = 'BAD_REQUEST';
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal Server Error';
      code = 'INTERNAL_SERVER_ERROR';
    }
    httpAdapter.reply(
      ctx.getResponse(),
      { error: { code, message } },
      httpStatus,
    );
  }
}
