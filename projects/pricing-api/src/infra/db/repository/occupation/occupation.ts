import { Injectable } from '@nestjs/common';

import { PrismaService } from '@infra/db/service';
import { FindOccupationByCodeRepository } from '@application/contract';
import { Occupation } from '@domain/entity';

@Injectable()
export class PostgresOccupationRepository
  implements FindOccupationByCodeRepository
{
  constructor(private prismaService: PrismaService) {}

  async findByCode(code: string, active: boolean = true): Promise<Occupation> {
    const dbCoverage = await this.prismaService.occupation.findUnique({
      where: { code, active },
    });
    return (
      dbCoverage &&
      Occupation.restore(
        dbCoverage.id,
        dbCoverage.name,
        dbCoverage.code,
        dbCoverage.active,
        dbCoverage.factor,
        dbCoverage.createdAt,
      )
    );
  }
}
