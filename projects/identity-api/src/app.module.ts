import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import {
  ChangeUserRoleController,
  CreateUserController,
  UserLoginController,
} from '@infra/http/controller';
import { PostgresUserRepository } from '@infra/db/repository';
import { PrismaService } from '@infra/db/service';
import { AuthenticationGuard, AuthorizationGuard } from '@infra/http/guard';
import { ChangeUserRole, CreateUser, UserLogin } from '@application/use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [
    CreateUserController,
    UserLoginController,
    ChangeUserRoleController,
  ],
  providers: [
    CreateUser,
    UserLogin,
    ChangeUserRole,
    PrismaService,
    AuthenticationGuard,
    AuthorizationGuard,
    { provide: 'UserRepository', useClass: PostgresUserRepository },
  ],
})
export class AppModule {}
