import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

import { AuthenticationGuard } from './authentication';

jest.mock('jsonwebtoken');

describe('AuthenticationGuard', () => {
  let guard: AuthenticationGuard;

  beforeEach(() => {
    guard = new AuthenticationGuard();
  });

  it('should throw UnauthorizedException if no token is provided', async () => {
    const context = createContext({ headers: {} });
    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    const context = createContext({
      headers: { authorization: 'Bearer invalidToken' },
    });
    (jwt.verify as jest.Mock).mockImplementationOnce(() => {
      throw new Error();
    });
    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should set user property on request if token is valid', async () => {
    const mockUser = { id: 1, username: 'testuser' };
    const mockToken = 'validToken';
    const context = createContext({
      headers: { authorization: `Bearer ${mockToken}` },
    });
    (jwt.verify as jest.Mock).mockReturnValueOnce(mockUser);
    await guard.canActivate(context);
    expect(context.switchToHttp().getRequest()['user']).toEqual(mockUser);
  });
});

function createContext(req: Partial<Request>): ExecutionContext {
  const mockRequest = Object.assign({}, req);
  const mockSwitchToHttp = jest.fn(() => ({
    getRequest: jest.fn().mockReturnValue(mockRequest),
  }));
  return {
    switchToHttp: mockSwitchToHttp,
  } as any;
}
