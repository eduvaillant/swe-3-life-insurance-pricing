import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { UserLogin } from '@application/use-case';
import { UserLoginInputDto, UserLoginOutputDto } from '@infra/http/dto';
import { Public } from '@infra/http/decorator';

@Controller()
export class UserLoginController {
  constructor(private readonly userLogin: UserLogin) {}

  @Post('auth')
  @Public()
  @HttpCode(HttpStatus.OK)
  async handle(@Body() input: UserLoginInputDto): Promise<UserLoginOutputDto> {
    const { user, token } = await this.userLogin.execute(input);
    return {
      data: {
        user,
        token,
      },
    };
  }
}
