import { Body, Controller, Param, Patch } from '@nestjs/common';

import {
  UpdateCoverageInputDto,
  UpdateCoverageOutputDto,
  UpdateCoverageParamsInputDto,
} from '@infra/http/dto';
import { Role, Roles } from '@infra/http/decorator';
import { UpdateCoverage } from '@application/use-case';

@Controller()
export class UpdateCoverageController {
  constructor(private readonly updateCoverage: UpdateCoverage) {}

  @Patch('coverage/:coverageId')
  @Roles(Role.Admin)
  async handle(
    @Body() input: UpdateCoverageInputDto,
    @Param() { coverageId }: UpdateCoverageParamsInputDto,
  ): Promise<UpdateCoverageOutputDto> {
    const output = await this.updateCoverage.execute({ ...input, coverageId });
    return {
      data: output,
    };
  }
}
