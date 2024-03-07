import { IsDefined, IsNumber, IsString } from 'class-validator';

export class CreateCoverageInputDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  description: string;

  @IsDefined()
  @IsNumber()
  capital: number;

  @IsDefined()
  @IsNumber()
  premium: number;
}

export class CreateCoverageOutputDto {
  data: {
    coverageId: string;
    name: string;
    description: string;
    capital: number;
    premium: number;
  };
}
