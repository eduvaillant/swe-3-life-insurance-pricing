import { IsString } from 'class-validator';

export class UserLoginInputDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export type UserLoginOutputDto = {
  data: {
    user: {
      userId: string;
      username: string;
      role: string;
    };
    token: string;
  };
};
