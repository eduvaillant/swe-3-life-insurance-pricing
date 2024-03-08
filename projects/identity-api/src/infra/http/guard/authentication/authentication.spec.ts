import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import { AuthenticationGuard } from './authentication';
import { TokenService } from '@domain/service';

jest.mock('@domain/service');

describe('AuthenticationGuard', () => {
  let guard: AuthenticationGuard;
  let mockReflector: Reflector;

  beforeEach(() => {
    mockReflector = {
      getAllAndOverride: jest.fn().mockReturnValue(false),
    } as any;
    guard = new AuthenticationGuard(mockReflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow access if endpoint is public', async () => {
    (mockReflector.getAllAndOverride as jest.Mock).mockReturnValueOnce(true);
    const fakeContext = createContext({});
    const result = await guard.canActivate(fakeContext);
    expect(result).toBe(true);
  });

  it('should throw UnauthorizedException if no token is provided', async () => {
    const context = createContext({ headers: { authorization: undefined } });
    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    const context = createContext({
      headers: { authorization: 'Bearer invalidToken' },
    });
    (TokenService.verify as jest.Mock).mockImplementationOnce(() => {
      throw new Error();
    });
    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});

function createContext(req: Partial<Request>): ExecutionContext {
  const mockSwitchToHttp = jest.fn().mockReturnValueOnce({
    getRequest: jest.fn().mockReturnValueOnce(req),
  });
  return {
    switchToHttp: mockSwitchToHttp,
    getHandler: jest.fn(),
    getClass: jest.fn(),
  } as any;
}
