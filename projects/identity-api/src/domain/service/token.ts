import * as jwt from 'jsonwebtoken';

import { User } from '@domain/entity';

export class TokenService {
  static generate(user: User): string {
    const payload = {
      sub: user.id,
      role: user.role,
    };
    return jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
      algorithm: 'RS256',
    });
  }

  static verify(token: string): any {
    return jwt.verify(token, process.env.JWT_PUBLIC_KEY);
  }
}
