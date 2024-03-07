import { IsString } from 'class-validator';

export class CreateUserInputDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export type CreateUserOutputDto = {
  data: {
    userId: string;
    username: string;
    role: string;
  };
};
