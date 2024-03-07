import { Inject, Injectable } from '@nestjs/common';

import {
  FindCoverageByIdRepository,
  UpdateCoverageRepository,
} from '@application/contract';
import { CoverageNotFoundError } from '@application/error';

@Injectable()
export class InactivateCoverage {
  constructor(
    @Inject('CoverageRepository')
    private coverageRepository: FindCoverageByIdRepository &
      UpdateCoverageRepository,
  ) {}

  async execute(input: Input): Promise<void> {
    const coverage = await this.coverageRepository.findById(input.coverageId);
    if (!coverage) throw new CoverageNotFoundError();
    coverage.inactivate();
    await this.coverageRepository.update(coverage);
  }
}

type Input = {
  coverageId: string;
};
