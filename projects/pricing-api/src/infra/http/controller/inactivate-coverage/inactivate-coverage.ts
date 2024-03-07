import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';

import { InactivateCoverageParamsInputDto } from '@infra/http/dto';
import { Role, Roles } from '@infra/http/decorator';
import { InactivateCoverage } from '@application/use-case';

@Controller()
export class InactivateCoverageController {
  constructor(private readonly inactivateCoverage: InactivateCoverage) {}

  @Delete('coverage/:coverageId')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @Param() { coverageId }: InactivateCoverageParamsInputDto,
  ): Promise<void> {
    await this.inactivateCoverage.execute({ coverageId });
  }
}
