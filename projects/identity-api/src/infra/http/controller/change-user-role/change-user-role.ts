import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';

import { ChangeUserRole } from '@application/use-case';
import {
  ChangeUserRoleInputDto,
  ChangeUserRoleOutputDto,
  ChangeUserRoleParamInputDto,
} from '@infra/http/dto';
import { Role, Roles } from '@infra/http/decorator';

@Controller()
export class ChangeUserRoleController {
  constructor(private readonly changeUserRole: ChangeUserRole) {}

  @Patch('users/:userId')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  async handle(
    @Body() input: ChangeUserRoleInputDto,
    @Param() { userId }: ChangeUserRoleParamInputDto,
  ): Promise<ChangeUserRoleOutputDto> {
    const output = await this.changeUserRole.execute({ ...input, userId });
    return {
      data: {
        userId: output.userId,
        username: output.username,
        role: output.role,
      },
    };
  }
}
