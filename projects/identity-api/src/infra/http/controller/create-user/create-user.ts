import { Body, Controller, Post } from '@nestjs/common';

import { CreateUser } from '@application/use-case';
import {
  CreateUserInputDto,
  CreateUserOutputDto,
} from '@infra/http/dto/create-user';
import { Role, Roles } from '@infra/http/decorator';

@Controller()
export class CreateUserController {
  constructor(private readonly createUser: CreateUser) {}

  @Post('users')
  @Roles(Role.Admin)
  async handle(
    @Body() input: CreateUserInputDto,
  ): Promise<CreateUserOutputDto> {
    const { userId, username, role } = await this.createUser.execute(input);
    return {
      data: {
        userId,
        username,
        role,
      },
    };
  }
}
