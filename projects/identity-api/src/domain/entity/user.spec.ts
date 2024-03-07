import { faker } from '@faker-js/faker';

import { User } from './user';

describe('User', () => {
  it('should create a new user', () => {
    const actualUser = User.create('aUsername', 'aA12345%');

    expect(actualUser.id).toBeDefined();
    expect(actualUser.username).toBe('aUsername');
    expect(actualUser.password).toBe('aA12345%');
    expect(actualUser.role).toBe('user');
    expect(actualUser.createdAt).toBeDefined();
    expect(actualUser.updatedAt).toBeDefined();
  });

  it.each([
    {
      text: 'less than 8 characters',
      invalidPassword: 'Pass123',
    },
    {
      text: 'more than 64 characters',
      invalidPassword: faker.string.alphanumeric({ length: 65 }),
    },
    {
      text: 'invalid character',
      invalidPassword: 'Pass123@)',
    },
    {
      text: 'less than one number',
      invalidPassword: 'Password',
    },
  ])('should throw if password is invalid ($text)', ({ invalidPassword }) => {
    const expectedError = new Error('Invalid Password');
    expect(() => User.create('aUsername', invalidPassword)).toThrow(
      expectedError,
    );
  });
});