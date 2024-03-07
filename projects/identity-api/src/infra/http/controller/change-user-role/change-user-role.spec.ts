import { MockProxy, mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';

import { ChangeUserRoleController } from './change-user-role';
import { ChangeUserRole } from '@application/use-case';

describe('ChangeUserRoleController', () => {
  let changeUserRoleController: ChangeUserRoleController;
  let mockedChangeUserRole: MockProxy<ChangeUserRole>;
  let fakeUserId: string;
  let fakeUsername: string;
  let fakeRole: string;

  beforeAll(() => {
    mockedChangeUserRole = mock();
    fakeUserId = faker.string.uuid();
    fakeUsername = faker.internet.userName();
    mockedChangeUserRole.execute.mockResolvedValue({
      userId: fakeUserId,
      username: fakeUsername,
      role: fakeRole,
    });
  });

  beforeEach(() => {
    changeUserRoleController = new ChangeUserRoleController(
      mockedChangeUserRole,
    );
  });

  it('should return the correct output on success', async () => {
    const input = {
      userId: fakeUserId,
      role: fakeRole,
    };
    const expectedOutput = {
      data: {
        userId: fakeUserId,
        username: fakeUsername,
        role: fakeRole,
      },
    };

    const actualOutput = await changeUserRoleController.handle(input, {
      userId: fakeUserId,
    });

    expect(mockedChangeUserRole.execute).toHaveBeenCalledTimes(1);
    expect(mockedChangeUserRole.execute).toHaveBeenCalledWith(input);
    expect(actualOutput).toEqual(expectedOutput);
  });

  it('should throw if ChangeUserRole throws', async () => {
    const input = {
      role: 'admin',
    };
    const expectedError = new Error('change-user-role-error');
    mockedChangeUserRole.execute.mockRejectedValueOnce(expectedError);

    await expect(
      changeUserRoleController.handle(input, { userId: fakeUserId }),
    ).rejects.toThrow(expectedError);
  });
});
