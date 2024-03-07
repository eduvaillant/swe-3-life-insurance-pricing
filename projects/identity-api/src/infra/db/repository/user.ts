import { Injectable } from '@nestjs/common';

import { PrismaService } from '@infra/db/service';
import {
  CreateUserRepository,
  FindUserByIdRepository,
  FindUserByUsernameRepository,
  UpdateUserRepository,
} from '@application/contract';
import { User } from '@domain/entity';

@Injectable()
export class PostgresUserRepository
  implements
    CreateUserRepository,
    FindUserByUsernameRepository,
    FindUserByIdRepository,
    UpdateUserRepository
{
  constructor(private prismaService: PrismaService) {}

  async create(user: User): Promise<void> {
    await this.prismaService.user.create({
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  }

  async findByUsername(username: string): Promise<User> {
    const dbUser = await this.prismaService.user.findUnique({
      where: { username },
    });
    return (
      dbUser &&
      User.restore(
        dbUser.id,
        dbUser.username,
        dbUser.password,
        dbUser.role,
        dbUser.createdAt,
        dbUser.updatedAt,
      )
    );
  }

  async findById(id: string): Promise<User> {
    const dbUser = await this.prismaService.user.findUnique({
      where: { id },
    });
    return (
      dbUser &&
      User.restore(
        dbUser.id,
        dbUser.username,
        dbUser.password,
        dbUser.role,
        dbUser.createdAt,
        dbUser.updatedAt,
      )
    );
  }

  async update(user: User): Promise<void> {
    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        username: user.username,
        role: user.role,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  }
}
