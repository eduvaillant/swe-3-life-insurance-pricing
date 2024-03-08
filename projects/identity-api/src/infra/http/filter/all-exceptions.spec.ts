import {
  InvalidUsernameOrPasswordError,
  UserAlreadyExistsError,
  UserNotFoundError,
} from '@application/error';
import { InvalidPasswordError, UserAlreadyHasRoleError } from '@domain/error';
import {
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from './all-exception';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockHttpAdapterHost: HttpAdapterHost;

  beforeEach(() => {
    mockHttpAdapterHost = {
      httpAdapter: {
        reply: jest.fn(),
      },
    } as any;
    filter = new AllExceptionsFilter(mockHttpAdapterHost);
  });

  it('should catch BadRequestException and respond with appropriate status code and message', () => {
    const exception = new BadRequestException('Bad request');
    const host = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue({}),
    } as any;

    filter.catch(exception, host);

    expect(mockHttpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
      expect.anything(),
      { error: { code: 'BAD_REQUEST', message: exception.message } },
      HttpStatus.BAD_REQUEST,
    );
  });

  it('should catch UnauthorizedException and respond with appropriate status code and message', () => {
    const exception = new UnauthorizedException();
    const host = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue({}),
    } as any;

    filter.catch(exception, host);

    expect(mockHttpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
      expect.anything(),
      { error: { code: 'UNAUTHORIZED', message: exception.message } },
      HttpStatus.UNAUTHORIZED,
    );
  });

  it('should catch ForbiddenException and respond with appropriate status code and message', () => {
    const exception = new ForbiddenException();
    const host = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue({}),
    } as any;

    filter.catch(exception, host);

    expect(mockHttpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
      expect.anything(),
      { error: { code: 'FORBIDDEN', message: exception.message } },
      HttpStatus.FORBIDDEN,
    );
  });

  it('should catch InvalidUsernameOrPasswordError and respond with appropriate status code and message', () => {
    const exception = new InvalidUsernameOrPasswordError();
    const host = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue({}),
    } as any;

    filter.catch(exception, host);

    expect(mockHttpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
      expect.anything(),
      { error: { code: 'UNAUTHORIZED', message: exception.message } },
      HttpStatus.UNAUTHORIZED,
    );
  });

  it('should catch UserAlreadyExistsError and respond with appropriate status code and message', () => {
    const exception = new UserAlreadyExistsError();
    const host = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue({}),
    } as any;

    filter.catch(exception, host);

    expect(mockHttpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
      expect.anything(),
      { error: { code: 'CONFLICT', message: exception.message } },
      HttpStatus.CONFLICT,
    );
  });

  it('should catch UserNotFoundError and respond with appropriate status code and message', () => {
    const exception = new UserNotFoundError();
    const host = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue({}),
    } as any;

    filter.catch(exception, host);

    expect(mockHttpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
      expect.anything(),
      { error: { code: 'NOT_FOUND', message: exception.message } },
      HttpStatus.NOT_FOUND,
    );
  });

  it('should catch InvalidPasswordError and respond with appropriate status code and message', () => {
    const exception = new InvalidPasswordError();
    const host = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue({}),
    } as any;

    filter.catch(exception, host);

    expect(mockHttpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
      expect.anything(),
      { error: { code: 'BAD_REQUEST', message: exception.message } },
      HttpStatus.BAD_REQUEST,
    );
  });

  it('should catch UserAlreadyHasRoleError and respond with appropriate status code and message', () => {
    const exception = new UserAlreadyHasRoleError();
    const host = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue({}),
    } as any;

    filter.catch(exception, host);

    expect(mockHttpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
      expect.anything(),
      { error: { code: 'BAD_REQUEST', message: exception.message } },
      HttpStatus.BAD_REQUEST,
    );
  });

  it('should catch unknown exceptions and respond with 500 Internal Server Error', () => {
    const exception = new Error('Unknown error');
    const host = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue({}),
    } as any;

    filter.catch(exception, host);

    expect(mockHttpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
      expect.anything(),
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal Server Error',
        },
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  });
});
