import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'AtLeastOneFieldPresent', async: false })
export class AtLeastOneFieldPresentValidator
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    const { object } = args;
    if (
      object['name'] !== undefined ||
      object['description'] !== undefined ||
      object['capital'] !== undefined ||
      object['premium'] !== undefined
    ) {
      return true;
    }
    return false;
  }

  defaultMessage() {
    return 'At least one of the fields (name, description, capital, premium) must be provided.';
  }
}
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

  @Validate(AtLeastOneFieldPresentValidator)
  atLeastOneFieldPresent: any;
}

export class UpdateCoverageParamsInputDto {
  @IsUUID()
  coverageId: string;
}

export type UpdateCoverageOutputDto = {
  data: {
    coverageId: string;
    name: string;
    description: string;
    capital: number;
    premium: number;
  };
};
