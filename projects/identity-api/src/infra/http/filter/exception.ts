import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    console.log(exception);
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    let httpStatus: number;
    let message: string;
    httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    if (
      httpStatus === HttpStatus.BAD_REQUEST ||
      httpStatus === HttpStatus.UNAUTHORIZED ||
      httpStatus === HttpStatus.FORBIDDEN
    ) {
      message =
        exception instanceof HttpException
          ? exception.getResponse()['message']
          : null;
    } else {
      switch (exception['message']) {
        case 'Username already exists on database!':
          httpStatus = HttpStatus.CONFLICT;
          message = exception['message'];
          break;
        case 'Username or Password are invalid!':
          httpStatus = HttpStatus.UNAUTHORIZED;
          message = exception['message'];
          break;
        case 'User already has this role!':
          httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
          message = exception['message'];
          break;
        case 'User not found!':
          httpStatus = HttpStatus.NOT_FOUND;
          message = exception['message'];
          break;
        default:
          httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
          message = 'Internal Server Error';
          break;
      }
    }
    httpAdapter.reply(
      ctx.getResponse(),
      { error: { code: httpStatus, message } },
      httpStatus,
    );
  }
}
