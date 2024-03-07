import { Type } from 'class-transformer';
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

export class CreateCoverageDataOutputDto {
  @IsString()
  coverageId: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  capital: number;

  @IsNumber()
  premium: number;
}

export class CreateCoverageOutputDto {
  @Type(() => CreateCoverageDataOutputDto)
  data: CreateCoverageDataOutputDto;
}
