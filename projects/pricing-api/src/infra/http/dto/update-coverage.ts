import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateCoverageInputDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  capital: number;

  @IsOptional()
  @IsNumber()
  premium: number;
}

export class UpdateCoverageParamsInputDto {
  @IsUUID()
  coverageId: string;
}

export class UpdateCoverageDataOutputDto {
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

export class UpdateCoverageOutputDto {
  @Type(() => UpdateCoverageDataOutputDto)
  data: UpdateCoverageDataOutputDto;
}
