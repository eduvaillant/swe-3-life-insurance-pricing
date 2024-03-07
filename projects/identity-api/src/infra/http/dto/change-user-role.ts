import { IsEnum, IsUUID } from 'class-validator';

enum Role {
  Admin = 'admin',
  User = 'user',
}
export class ChangeUserRoleParamInputDto {
  @IsUUID()
  userId: string;
}

export class ChangeUserRoleInputDto {
  @IsEnum(Role)
  role: string;
}

export type ChangeUserRoleOutputDto = {
  data: {
    userId: string;
    username: string;
    role: string;
  };
};
