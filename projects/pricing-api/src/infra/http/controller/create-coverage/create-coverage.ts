import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import {
  CreateCoverageInputDto,
  CreateCoverageOutputDto,
} from '@infra/http/dto';
import { AuthenticationGuard, AuthorizationGuard } from '@infra/http/guard';
import { Role, Roles } from '@infra/http/decorator';
import { CreateCoverage } from '@application/use-case';

@Controller()
export class CreateCoverageController {
  constructor(private readonly createCoverage: CreateCoverage) {}

  @Post('coverage')
  @Roles(Role.Admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async handle(
    @Body() input: CreateCoverageInputDto,
  ): Promise<CreateCoverageOutputDto> {
    const { coverageId, name, description, capital, premium } =
      await this.createCoverage.execute(input);
    return {
      data: {
        coverageId,
        name,
        description,
        capital,
        premium,
      },
    };
  }
}
