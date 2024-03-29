import { MockProxy, mock } from 'jest-mock-extended';

import { ChangeUserRole } from './change-user-role';
import {
  FindUserByIdRepository,
  UpdateUserRepository,
} from '@application/contract';
import { UserNotFoundError } from '@application/error';
import { User } from '@domain/entity';
import { UserAlreadyHasRoleError } from '@domain/error';

describe('ChangeUserRole', () => {
  let changeUserRole: ChangeUserRole;
  let fakeUser: User;
  let mockedFindUserByIdRepository: MockProxy<
    FindUserByIdRepository & UpdateUserRepository
  >;

  beforeEach(() => {
    mockedFindUserByIdRepository = mock();
    fakeUser = User.create('aUsername', 'Pass1234@');
    mockedFindUserByIdRepository.findById.mockResolvedValue(fakeUser);
    changeUserRole = new ChangeUserRole(mockedFindUserByIdRepository);
  });

  it('should return the correct output on success', async () => {
    const expectedOutput = {
      userId: fakeUser.id,
      username: fakeUser.username,
      role: 'admin',
    };
    const input = {
      userId: fakeUser.id,
      role: 'admin',
    };

    const actualOutput = await changeUserRole.execute(input);

    expect(actualOutput).toEqual(expectedOutput);
    expect(mockedFindUserByIdRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockedFindUserByIdRepository.findById).toHaveBeenCalledWith(
      input.userId,
    );
    expect(mockedFindUserByIdRepository.update).toHaveBeenCalledTimes(1);
    expect(mockedFindUserByIdRepository.update).toHaveBeenCalledWith(fakeUser);
  });

  it('should throw if user was not found', async () => {
    const input = {
      userId: fakeUser.id,
      role: 'admin',
    };
    mockedFindUserByIdRepository.findById.mockResolvedValueOnce(undefined);

    await expect(changeUserRole.execute(input)).rejects.toThrow(
      UserNotFoundError,
    );
  });

  it('should throw if user already has the inputed role', async () => {
    const input = {
      userId: fakeUser.id,
      role: 'user',
    };

    await expect(changeUserRole.execute(input)).rejects.toThrow(
      UserAlreadyHasRoleError,
    );
  });
});
