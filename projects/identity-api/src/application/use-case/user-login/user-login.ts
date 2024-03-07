import { Inject, Injectable } from '@nestjs/common';

import { FindUserByUsernameRepository } from '@application/contract';
import { TokenService } from '@domain/service';
import { InvalidUsernameOrPasswordError } from '@application/error';

@Injectable()
export class UserLogin {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: FindUserByUsernameRepository,
  ) {}

  async execute({ username, password }: Input): Promise<Output> {
    const user = await this.userRepository.findByUsername(username);
    if (!user || !user.password.compare(password))
      throw new InvalidUsernameOrPasswordError();
    const token = TokenService.generate(user);
    return {
      user: {
        userId: user.id,
        username: user.username,
        role: user.role,
      },
      token,
    };
  }
}

type Input = {
  username: string;
  password: string;
};

type Output = {
  user: {
    userId: string;
    username: string;
    role: string;
  };
  token: string;
};
