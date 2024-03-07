import { MockProxy, mock } from 'jest-mock-extended';
import * as jwt from 'jsonwebtoken';

import { UserLoginController } from './user-login';
import { UserLogin } from '@application/use-case';
import { User } from '@domain/entity';

describe('UserLoginController', () => {
  let userLoginController: UserLoginController;
  let mockedUserLogin: MockProxy<UserLogin>;
  let fakeUser: User;
  let fakeToken: string;

  beforeAll(() => {
    mockedUserLogin = mock();
    fakeUser = User.create('aUsername', 'Pass1234@');
    fakeToken = jwt.sign({ sub: fakeUser.id, role: fakeUser.role }, 'secret');
    mockedUserLogin.execute.mockResolvedValue({
      user: {
        userId: fakeUser.id,
        username: fakeUser.username,
        role: fakeUser.role,
      },
      token: fakeToken,
    });
  });

  beforeEach(() => {
    userLoginController = new UserLoginController(mockedUserLogin);
  });

  it('should return the correct output on success', async () => {
    const input = {
      username: 'aUsername',
      password: 'Pass1234@',
    };
    const expectedOutput = {
      data: {
        user: {
          userId: fakeUser.id,
          username: fakeUser.username,
          role: fakeUser.role,
        },
        token: fakeToken,
      },
    };

    const actualOutput = await userLoginController.handle(input);

    expect(mockedUserLogin.execute).toHaveBeenCalledTimes(1);
    expect(mockedUserLogin.execute).toHaveBeenCalledWith(input);
    expect(actualOutput).toEqual(expectedOutput);
  });

  it('should throw if UserLogin throws', async () => {
    const input = {
      username: 'aUsername',
      password: 'Pass1234@',
    };
    const expectedError = new Error('login-error');
    mockedUserLogin.execute.mockRejectedValueOnce(expectedError);

    await expect(userLoginController.handle(input)).rejects.toThrow(
      expectedError,
    );
  });
});
