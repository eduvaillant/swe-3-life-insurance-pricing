import { AuthorizationGuard } from './authorization';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@infra/http/decorator';

describe('AuthorizationGuard', () => {
  let guard: AuthorizationGuard;
  let mockReflector: Reflector;

  beforeEach(() => {
    mockReflector = {
      getAllAndOverride: jest.fn(),
    } as any;
    guard = new AuthorizationGuard(mockReflector);
  });

  it('should throw ForbiddenException if user does not have required role', async () => {
    const context = createContext('admin');
    (mockReflector.getAllAndOverride as jest.Mock).mockReturnValueOnce(false);
    (mockReflector.getAllAndOverride as jest.Mock).mockReturnValueOnce([
      Role.User,
    ]);

    await expect(guard.canActivate(context)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should return true if endpoint is public', async () => {
    const context = createContext('admin');
    (mockReflector.getAllAndOverride as jest.Mock).mockReturnValueOnce(true);
    (mockReflector.getAllAndOverride as jest.Mock).mockReturnValueOnce([
      Role.Admin,
    ]);

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should return true if user has required role', async () => {
    const context = createContext('admin');
    (mockReflector.getAllAndOverride as jest.Mock).mockReturnValueOnce(false);
    (mockReflector.getAllAndOverride as jest.Mock).mockReturnValueOnce([
      Role.Admin,
    ]);

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });
});

function createContext(userRole: string): ExecutionContext {
  const mockRequest = {
    user: { role: userRole },
  };
  const mockSwitchToHttp = jest.fn(() => ({
    getRequest: jest.fn().mockReturnValue(mockRequest),
  }));
  return {
    switchToHttp: mockSwitchToHttp,
    getHandler: jest.fn(),
    getClass: jest.fn(),
  } as any;
}
