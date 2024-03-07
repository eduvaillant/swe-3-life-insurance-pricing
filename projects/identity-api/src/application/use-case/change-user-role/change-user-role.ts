import { Inject, Injectable } from '@nestjs/common';

import {
  FindUserByIdRepository,
  UpdateUserRepository,
} from '@application/contract';
import { UserNotFoundError } from '@application/error';

@Injectable()
export class ChangeUserRole {
  constructor(
    @Inject('UserRepository')
    private userRepository: FindUserByIdRepository & UpdateUserRepository,
  ) {}

  async execute({ userId, role }: Input): Promise<Output> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundError();
    user.changeRole(role);
    await this.userRepository.update(user);
    return {
      userId: user.id,
      username: user.username,
      role: user.role,
    };
  }
}

type Input = {
  userId: string;
  role: string;
};

type Output = {
  userId: string;
  username: string;
  role: string;
};
