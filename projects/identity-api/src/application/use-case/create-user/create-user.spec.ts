import * as crypto from 'node:crypto';
import { faker } from '@faker-js/faker';
import { MockProxy, mock } from 'jest-mock-extended';

import { CreateUser } from './create-user';
import {
  CreateUserRepository,
  FindUserByUsernameRepository,
} from '@application/contract';
import { User } from '@domain/entity';

jest.mock('node:crypto', () => {
  return {
    randomUUID: jest.fn(),
  };
});

describe('CreateUser', () => {
  let createUser: CreateUser;
  let mockedUserRepository: MockProxy<
    CreateUserRepository & FindUserByUsernameRepository
  >;
  let mockedUserId: string;

  beforeAll(() => {
    mockedUserId = faker.string.uuid();
    (crypto.randomUUID as jest.Mock).mockReturnValue(mockedUserId);
  });

  beforeEach(() => {
    mockedUserRepository = mock();
    createUser = new CreateUser(mockedUserRepository);
  });

  it('should return the correct output on success', async () => {
    const expectedOutput = {
      userId: mockedUserId,
      username: 'anyUsername',
      role: 'user',
    };
    const input = {
      username: 'anyUsername',
      password: 'Pass1234@',
    };

    const actualOutput = await createUser.execute(input);

    expect(actualOutput).toEqual(expectedOutput);
    expect(mockedUserRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should throw if CreateUserRepository throws', async () => {
    const expectedError = new Error('save-error');
    mockedUserRepository.create.mockRejectedValueOnce(expectedError);
    const input = {
      username: 'anyUsername',
      password: 'Pass1234@',
    };

    await expect(createUser.execute(input)).rejects.toThrow(expectedError);
  });

  it('should throw if username already exists on database', async () => {
    const input = {
      username: 'anyUsername',
      password: 'Pass1234@',
    };
    const fakeUser = User.create(input.username, input.password);
    const expectedError = new Error('Username already exists on database!');
    mockedUserRepository.findByUsername.mockResolvedValueOnce(fakeUser);

    await expect(createUser.execute(input)).rejects.toThrow(expectedError);
    expect(mockedUserRepository.findByUsername).toHaveBeenCalledTimes(1);
    expect(mockedUserRepository.findByUsername).toHaveBeenCalledWith(
      input.username,
    );
    expect(mockedUserRepository.create).not.toHaveBeenCalled();
  });
});
