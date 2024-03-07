import { Inject, Injectable } from '@nestjs/common';

import {
  FindCoverageByIdRepository,
  FindCoverageByNameRepository,
  UpdateCoverageRepository,
} from '@application/contract';
import {
  CoverageAlreadyExistsError,
  CoverageNotFoundError,
} from '@application/error';

@Injectable()
export class UpdateCoverage {
  constructor(
    @Inject('CoverageRepository')
    private coverageRepository: FindCoverageByIdRepository &
      UpdateCoverageRepository &
      FindCoverageByNameRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const coverage = await this.coverageRepository.findById(input.coverageId);
    if (!coverage) throw new CoverageNotFoundError();
    if (input.name) {
      const existingCoverageWithImputedName =
        await this.coverageRepository.findByName(input.name);
      if (existingCoverageWithImputedName)
        throw new CoverageAlreadyExistsError();
      coverage.changeName(input.name);
    }
    if (input.description) coverage.changeDescription(input.description);
    if (input.capital) coverage.changeCapital(input.capital);
    if (input.premium) coverage.changePremium(input.premium);
    await this.coverageRepository.update(coverage);
    return {
      coverageId: coverage.id,
      name: coverage.name,
      description: coverage.description,
      capital: coverage.capital,
      premium: coverage.premium,
    };
  }
}

type Input = {
  coverageId: string;
  name?: string;
  description?: string;
  capital?: number;
  premium?: number;
};

type Output = {
  coverageId: string;
  name: string;
  description: string;
  capital: number;
  premium: number;
};
