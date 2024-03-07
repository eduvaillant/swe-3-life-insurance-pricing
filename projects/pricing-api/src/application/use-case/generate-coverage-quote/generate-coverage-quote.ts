import { Inject, Injectable } from '@nestjs/common';

import {
  FindCoverageByIdRepository,
  FindOccupationByCodeRepository,
} from '@application/contract';
import { FactorByAge } from '@domain/service';
import { Coverage } from '@domain/entity';
import {
  CoverageNotFoundError,
  OccupationNotFoundError,
} from '@application/error';

@Injectable()
export class GenerateCoverageQuote {
  constructor(
    @Inject('OccupationRepository')
    private readonly occupationRepository: FindOccupationByCodeRepository,
    @Inject('CoverageRepository')
    private readonly coverageRepository: FindCoverageByIdRepository,
  ) {}

  async execute({
    age,
    occupationCode,
    capital,
    coverageIds,
  }: Input): Promise<Output> {
    const occupation =
      await this.occupationRepository.findByCode(occupationCode);
    if (!occupation) throw new OccupationNotFoundError();
    const coverages = await this.getCoverages(coverageIds);
    const ageFactor = FactorByAge.getInstance().getFactor(age);
    const calculatedCoverages = coverages.map((coverage) => {
      const premium = parseFloat(
        (
          Math.ceil(capital / coverage.capital) *
          coverage.premium *
          occupation.factor *
          ageFactor
        ).toFixed(2),
      );
      return {
        coverageId: coverage.id,
        premium,
      };
    });
    return {
      capital,
      occupationFactor: occupation.factor,
      ageFactor: ageFactor,
      coverages: calculatedCoverages,
      premium: calculatedCoverages.reduce(
        (total, coverage) => total + coverage.premium,
        0,
      ),
    };
  }

  private async getCoverages(coverageIds: string[]): Promise<Coverage[]> {
    const coverages: Coverage[] = [];
    for (const coverageId of coverageIds) {
      const coverage = await this.coverageRepository.findById(coverageId);
      if (!coverage || !coverage.active) throw new CoverageNotFoundError();
      coverages.push(coverage);
    }
    return coverages;
  }
}

type Input = {
  age: number;
  occupationCode: string;
  capital: number;
  coverageIds: string[];
};

type Output = {
  ageFactor: number;
  occupationFactor: number;
  coverages: {
    coverageId: string;
    premium: number;
  }[];
  capital: number;
  premium: number;
};
