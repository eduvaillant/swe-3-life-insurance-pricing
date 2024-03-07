import { Inject, Injectable } from '@nestjs/common';

import { FindUserByUsernameRepository } from '@application/contract';
import { TokenService } from '@domain/service';

@Injectable()
export class UserLogin {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: FindUserByUsernameRepository,
  ) {}

  async execute({ username, password }: Input): Promise<Output> {
    const user = await this.userRepository.findByUsername(username);
    if (!user || user.password !== password)
      throw new Error('Username or Password are invalid!');
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
