import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import {
  GenerateCoverageQuoteInputDto,
  GenerateCoverageQuoteOutputDto,
} from '@infra/http/dto';
import { Role, Roles } from '@infra/http/decorator/role';
import { GenerateCoverageQuote } from '@application/use-case';

@Controller()
export class GenerateCoverageQuoteController {
  constructor(private readonly generateCoverageQuote: GenerateCoverageQuote) {}

  @Post('quote')
  @Roles(Role.User, Role.Admin)
  @HttpCode(HttpStatus.OK)
  async handle(
    @Body() input: GenerateCoverageQuoteInputDto,
  ): Promise<GenerateCoverageQuoteOutputDto> {
    const output = await this.generateCoverageQuote.execute({
      ...input,
      coverageIds: input.coverages,
    });
    return {
      data: output,
    };
  }
}
