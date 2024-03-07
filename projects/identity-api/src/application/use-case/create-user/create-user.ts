import { Inject, Injectable } from '@nestjs/common';

import { User } from '@domain/entity';
import {
  CreateUserRepository,
  FindUserByUsernameRepository,
} from '@application/contract';

@Injectable()
export class CreateUser {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: CreateUserRepository &
      FindUserByUsernameRepository,
  ) {}

  async execute({ username, password }: Input): Promise<Output> {
    const user = await this.userRepository.findByUsername(username);
    if (user) throw new Error('Username already exists on database!');
    const createdUser = User.create(username, password);
    await this.userRepository.create(createdUser);
    return {
      userId: createdUser.id,
      username: createdUser.username,
      role: createdUser.role,
    };
  }
}

export type Input = {
  username: string;
  password: string;
};

export type Output = {
  userId: string;
  username: string;
  role: string;
};
