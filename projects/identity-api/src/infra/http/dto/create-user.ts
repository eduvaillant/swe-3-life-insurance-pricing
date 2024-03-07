import { Type } from 'class-transformer';
import { IsDefined, IsString, Matches } from 'class-validator';

export class CreateUserInputDto {
  @IsDefined()
  @IsString()
  username: string;

  @IsDefined()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#!$%])[A-Za-z\d@#!$%]{8,64}$/,
    { message: 'Invalid Password' },
  )
  password: string;
}

export class CreateUserDataDto {
  @IsString()
  userId: string;

  @IsString()
  username: string;

  @IsString()
  role: string;
}

export class CreateUserOutputDto {
  @Type(() => CreateUserDataDto)
  data: CreateUserDataDto;
}
