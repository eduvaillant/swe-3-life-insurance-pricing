import { MockProxy, mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';

import { CreateUserController } from './create-user';
import { CreateUser } from '@application/use-case';

describe('CreateUserController', () => {
  let createUserController: CreateUserController;
  let mockedCreateUser: MockProxy<CreateUser>;
  let fakeUserId: string;
  let fakeUsername: string;
  let fakeRole: string;

  beforeAll(() => {
    mockedCreateUser = mock();
    fakeUserId = faker.string.uuid();
    fakeUsername = faker.internet.userName();
    fakeRole = 'user';
    mockedCreateUser.execute.mockResolvedValue({
      userId: fakeUserId,
      username: fakeUsername,
      role: fakeRole,
    });
  });

  beforeEach(() => {
    createUserController = new CreateUserController(mockedCreateUser);
  });

  it('should return the correct output on success', async () => {
    const input = {
      username: 'aUsername',
      password: 'Pass1234@',
    };
    const expectedOutput = {
      data: {
        userId: fakeUserId,
        username: fakeUsername,
        role: fakeRole,
      },
    };

    const actualOutput = await createUserController.handle(input);

    expect(mockedCreateUser.execute).toHaveBeenCalledTimes(1);
    expect(mockedCreateUser.execute).toHaveBeenCalledWith(input);
    expect(actualOutput).toEqual(expectedOutput);
  });

  it('should throw if CreateUser throws', async () => {
    const input = {
      username: 'aUsername',
      password: 'Pass1234@',
    };
    const expectedError = new Error('create-error');
    mockedCreateUser.execute.mockRejectedValueOnce(expectedError);

    await expect(createUserController.handle(input)).rejects.toThrow(
      expectedError,
    );
  });
});
