import { Inject, Injectable } from '@nestjs/common';

import { Coverage } from '@domain/entity';
import {
  CreateCoverageRepository,
  FindCoverageByNameRepository,
} from '@application/contract';
import { CoverageAlreadyExistsError } from '@application/error';

@Injectable()
export class CreateCoverage {
  constructor(
    @Inject('CoverageRepository')
    private readonly CoverageRepository: CreateCoverageRepository &
      FindCoverageByNameRepository,
  ) {}

  async execute({
    name,
    description,
    capital,
    premium,
  }: Input): Promise<Output> {
    const coverage = await this.CoverageRepository.findByName(name);
    if (coverage) throw new CoverageAlreadyExistsError();
    const createdCoverage = Coverage.create(
      name,
      description,
      capital,
      premium,
    );
    await this.CoverageRepository.create(createdCoverage);
    return {
      coverageId: createdCoverage.id,
      name: createdCoverage.name,
      description: createdCoverage.description,
      capital: createdCoverage.capital,
      premium: createdCoverage.premium,
    };
  }
}

type Input = {
  name: string;
  description: string;
  capital: number;
  premium: number;
};

type Output = {
  coverageId: string;
  name: string;
  description: string;
  capital: number;
  premium: number;
};
