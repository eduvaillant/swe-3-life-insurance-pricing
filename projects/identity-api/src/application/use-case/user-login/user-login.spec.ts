import * as jwt from 'jsonwebtoken';
import { MockProxy, mock } from 'jest-mock-extended';

import { UserLogin } from './user-login';
import { FindUserByUsernameRepository } from '@application/contract';
import { User } from '@domain/entity';
import { TokenService } from '@domain/service';

describe('UserLogin', () => {
  let userLogin: UserLogin;
  let fakeToken: string;
  let fakeUser: User;
  let mockedFindUserByUsernameRepository: MockProxy<FindUserByUsernameRepository>;

  beforeAll(() => {
    mockedFindUserByUsernameRepository = mock();
    fakeUser = User.create('aUsername', 'Pass1234@');
    mockedFindUserByUsernameRepository.findByUsername.mockResolvedValue(
      fakeUser,
    );
    fakeToken = jwt.sign({ sub: fakeUser.id, role: fakeUser.role }, 'secret');
  });

  beforeEach(() => {
    userLogin = new UserLogin(mockedFindUserByUsernameRepository);
  });

  it('should return the correct output on success', async () => {
    const expectedOutput = {
      user: {
        userId: fakeUser.id,
        username: fakeUser.username,
        role: fakeUser.role,
      },
      token: fakeToken,
    };
    const tokenServiceGenerateSpy = jest.spyOn(TokenService, 'generate');
    tokenServiceGenerateSpy.mockReturnValueOnce(fakeToken);
    const input = {
      username: 'aUsername',
      password: 'Pass1234@',
    };

    const actualOutput = await userLogin.execute(input);

    expect(actualOutput).toEqual(expectedOutput);
    expect(tokenServiceGenerateSpy).toHaveBeenCalledTimes(1);
    expect(tokenServiceGenerateSpy).toHaveBeenCalledWith(fakeUser);
    expect(
      mockedFindUserByUsernameRepository.findByUsername,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockedFindUserByUsernameRepository.findByUsername,
    ).toHaveBeenCalledWith(input.username);
  });

  it('should throw if there is no user for specified username', async () => {
    const expectedError = new Error('Username or Password are invalid!');
    const input = {
      username: 'aUsername',
      password: 'Pass1234@',
    };
    mockedFindUserByUsernameRepository.findByUsername.mockResolvedValueOnce(
      undefined,
    );

    await expect(userLogin.execute(input)).rejects.toThrow(expectedError);
  });

  it('should throw if inputed password is incorrect', async () => {
    const expectedError = new Error('Username or Password are invalid!');
    const input = {
      username: 'aUsername',
      password: 'Pass1234',
    };

    await expect(userLogin.execute(input)).rejects.toThrow(expectedError);
  });
});
