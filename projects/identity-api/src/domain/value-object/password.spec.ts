import * as bcrypt from 'bcryptjs';

import { Password } from './password';
import { InvalidPasswordError } from '@domain/error';

jest.mock('bcryptjs', () => ({
  hashSync: jest.fn((password: string) => password),
  compareSync: jest.fn(
    (password: string, hashedPassword: string) => password === hashedPassword,
  ),
}));

describe('Password', () => {
  describe('create()', () => {
    it('should create a password with valid input', () => {
      const validPassword = 'TestPassword123!';
      const hashedPassword = Password.create(validPassword);

      expect(hashedPassword.getValue()).toEqual(validPassword);
      expect(bcrypt.hashSync).toHaveBeenCalledWith(validPassword, 8);
    });

    it('should throw InvalidPasswordError with invalid input', () => {
      const invalidPassword = 'invalid';
      expect(() => Password.create(invalidPassword)).toThrow(
        InvalidPasswordError,
      );
    });
  });

  describe('restore()', () => {
    it('should restore a password', () => {
      const passwordString = 'TestPassword123!';
      const restoredPassword = Password.restore(passwordString);

      expect(restoredPassword.getValue()).toEqual(passwordString);
    });
  });

  describe('compare', () => {
    it('should return true for matching passwords', () => {
      const passwordString = 'TestPassword123!';
      const password = Password.create(passwordString);

      expect(password.compare(passwordString)).toBe(true);
    });

    it('should return false for non-matching passwords', () => {
      const passwordString = 'TestPassword123!';
      const password = Password.create(passwordString);

      expect(password.compare('DifferentPassword')).toBe(false);
    });
  });
});
