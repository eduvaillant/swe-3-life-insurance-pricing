import * as jwt from 'jsonwebtoken';

import { TokenService } from './token';
import { User } from '@domain/entity';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mockedToken'),
  verify: jest.fn(() => ({ userId: 'fakeUserId', role: 'fakeRole' })),
}));

describe('TokenService', () => {
  describe('generate', () => {
    it('should generate a token with the correct payload', () => {
      process.env.JWT_PRIVATE_KEY = 'testPrivateKey';
      process.env.JWT_EXPIRES_IN = '1h';
      const fakeUser = User.create('aUsername', 'Pass1234@');

      const actualToken = TokenService.generate(fakeUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        { sub: fakeUser.id, role: fakeUser.role },
        process.env.JWT_PRIVATE_KEY,
        { expiresIn: process.env.JWT_EXPIRES_IN, algorithm: 'RS256' },
      );

      expect(actualToken).toEqual('mockedToken');
    });

    it('should generate a token with the correct payload', () => {
      process.env.JWT_PUBLIC_KEY = 'testPublicKey';
      const expectedDecodedToken = { userId: 'fakeUserId', role: 'fakeRole' };
      const fakeToken = 'fakeToken';

      const actualDecodedToken = TokenService.verify(fakeToken);

      expect(jwt.verify).toHaveBeenCalledWith(
        fakeToken,
        process.env.JWT_PUBLIC_KEY,
      );

      expect(actualDecodedToken).toEqual(expectedDecodedToken);
    });
  });
});
