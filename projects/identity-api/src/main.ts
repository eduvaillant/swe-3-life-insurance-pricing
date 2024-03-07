import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from '@infra/http/filter';
import { AuthenticationGuard, AuthorizationGuard } from '@infra/http/guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(
    app.get<AuthenticationGuard>(AuthenticationGuard),
    app.get<AuthorizationGuard>(AuthorizationGuard),
  );
  await app.listen(3030);
}
bootstrap();
