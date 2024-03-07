import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import {
  CreateCoverageController,
  GenerateCoverageQuoteController,
  InactivateCoverageController,
  UpdateCoverageController,
} from '@infra/http/controller';
import {
  CreateCoverage,
  GenerateCoverageQuote,
  InactivateCoverage,
  UpdateCoverage,
} from '@application/use-case';
import { PrismaService } from '@infra/db/service';
import {
  PostgresCoverageRepository,
  PostgresOccupationRepository,
} from '@infra/db/repository';
import { AuthenticationGuard, AuthorizationGuard } from '@infra/http/guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [
    CreateCoverageController,
    UpdateCoverageController,
    InactivateCoverageController,
    GenerateCoverageQuoteController,
  ],
  providers: [
    PrismaService,
    CreateCoverage,
    UpdateCoverage,
    InactivateCoverage,
    GenerateCoverageQuote,
    AuthenticationGuard,
    AuthorizationGuard,
    { provide: 'CoverageRepository', useClass: PostgresCoverageRepository },
    { provide: 'OccupationRepository', useClass: PostgresOccupationRepository },
  ],
})
export class AppModule {}
