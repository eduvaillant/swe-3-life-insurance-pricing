import { Injectable } from '@nestjs/common';

import { PrismaService } from '@infra/db/service';
import {
  CreateCoverageRepository,
  FindCoverageByIdRepository,
  FindCoverageByNameRepository,
  UpdateCoverageRepository,
} from '@application/contract';
import { Coverage } from '@domain/entity';

@Injectable()
export class PostgresCoverageRepository
  implements
    CreateCoverageRepository,
    FindCoverageByNameRepository,
    FindCoverageByIdRepository,
    UpdateCoverageRepository
{
  constructor(private prismaService: PrismaService) {}

  async create(coverage: Coverage): Promise<void> {
    await this.prismaService.coverage.create({
      data: {
        id: coverage.id,
        name: coverage.name,
        description: coverage.description,
        capital: coverage.capital,
        premium: coverage.premium,
        active: coverage.active,
        createdAt: coverage.createdAt,
        updatedAt: coverage.updatedAt,
        deletedAt: coverage.deletedAt,
      },
    });
  }

  async findByName(name: string): Promise<Coverage> {
    const dbCoverage = await this.prismaService.coverage.findUnique({
      where: { name },
    });
    return (
      dbCoverage &&
      Coverage.restore(
        dbCoverage.id,
        dbCoverage.name,
        dbCoverage.description,
        dbCoverage.capital,
        dbCoverage.premium,
        dbCoverage.active,
        dbCoverage.createdAt,
        dbCoverage.updatedAt,
        dbCoverage.deletedAt,
      )
    );
  }

  async findById(id: string, active: boolean = false): Promise<Coverage> {
    const dbCoverage = await this.prismaService.coverage.findUnique({
      where: { id, active: active ? true : undefined },
    });
    return (
      dbCoverage &&
      Coverage.restore(
        dbCoverage.id,
        dbCoverage.name,
        dbCoverage.description,
        dbCoverage.capital,
        dbCoverage.premium,
        dbCoverage.active,
        dbCoverage.createdAt,
        dbCoverage.updatedAt,
        dbCoverage.deletedAt,
      )
    );
  }

  async update(coverage: Coverage): Promise<void> {
    await this.prismaService.coverage.update({
      where: { id: coverage.id },
      data: {
        id: coverage.id,
        name: coverage.name,
        description: coverage.description,
        capital: coverage.capital,
        premium: coverage.premium,
        active: coverage.active,
        createdAt: coverage.createdAt,
        updatedAt: coverage.updatedAt,
        deletedAt: coverage.deletedAt,
      },
    });
  }
}
