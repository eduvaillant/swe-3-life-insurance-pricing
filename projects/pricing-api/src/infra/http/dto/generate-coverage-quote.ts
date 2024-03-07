import {
  IsDefined,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class GenerateCoverageQuoteInputDto {
  @IsNumber()
  @Min(18)
  @Max(60)
  age: number;

  @IsDefined()
  @IsString()
  occupationCode: string;

  @IsNumber()
  @Min(10000)
  @Max(10000000)
  capital: number;

  @IsUUID('4', { each: true })
  coverages: string[];
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
