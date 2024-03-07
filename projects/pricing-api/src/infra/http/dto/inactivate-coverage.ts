import { IsUUID } from 'class-validator';

export class InactivateCoverageParamsInputDto {
  @IsUUID()
  coverageId: string;
}
