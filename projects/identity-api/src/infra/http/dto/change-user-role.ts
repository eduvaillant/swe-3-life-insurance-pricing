import { Type } from 'class-transformer';
import { IsDefined, IsString, IsUUID } from 'class-validator';

export class ChangeUserRoleParamInputDto {
  @IsDefined()
  @IsUUID()
  userId: string;
}

export class ChangeUserRoleInputDto {
  @IsDefined()
  @IsString()
  role: string;
}

export class ChangeUserRoleDataDto {
  @IsString()
  userId: string;

  @IsString()
  username: string;

  @IsString()
  role: string;
}

export class ChangeUserRoleOutputDto {
  @Type(() => ChangeUserRoleDataDto)
  data: ChangeUserRoleDataDto;
}
