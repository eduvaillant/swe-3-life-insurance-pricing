import { IsDefined, IsNumber, IsString, Max, Min } from 'class-validator';

export class GenerateCoverageQuoteInputDto {
  @IsDefined()
  @IsNumber()
  @Min(18)
  @Max(60)
  age: number;

  @IsDefined()
  @IsString()
  occupationCode: string;

  @IsDefined()
  @IsNumber()
  @Min(10000)
  @Max(10000000)
  capital: number;

  @IsDefined()
  @IsString()
  coverages: string;
}

export type GenerateCoverageQuoteOutputDto = {
  data: {
    ageFactor: number;
    occupationFactor: number;
    coverages: {
      coverageId: string;
      premium: number;
    }[];
    capital: number;
    premium: number;
  };
};
