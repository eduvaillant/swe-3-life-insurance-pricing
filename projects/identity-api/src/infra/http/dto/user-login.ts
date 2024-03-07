import { Type } from 'class-transformer';
import { IsDefined, IsString, Matches } from 'class-validator';

export class UserLoginInputDto {
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

export class User {
  @IsString()
  userId: string;

  @IsString()
  username: string;

  @IsString()
  role: string;
}

export class UserLoginData {
  @Type(() => User)
  user: User;

  @IsString()
  token: string;
}

export class UserLoginOutputDto {
  @Type(() => UserLoginData)
  data: UserLoginData;
}
