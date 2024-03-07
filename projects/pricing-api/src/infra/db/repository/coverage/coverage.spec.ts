import { MockProxy, mock, mockReset } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

import { PostgresCoverageRepository } from './Coverage';
import { Coverage } from '@domain/entity';

describe('PostgresCoverageRepository', () => {
  let postgresCoverageRepository: PostgresCoverageRepository;
  let mockedPrismaService: any;
  let fakeCoverage: Coverage;

  beforeAll(() => {
    fakeCoverage = Coverage.create(
      faker.lorem.sentence(),
      faker.lorem.paragraph(2),
      1000,
      200,
    );
    mockedPrismaService = mock();
    const CoveragePrismaMock: MockProxy<
      Pick<PrismaClient['coverage'], 'findUnique' | 'create'>
    > = mock();
    mockedPrismaService['coverage'] = CoveragePrismaMock;
  });

  beforeEach(() => {
    postgresCoverageRepository = new PostgresCoverageRepository(
      mockedPrismaService,
    );
  });

  afterEach(() => {
    mockReset(mockedPrismaService);
  });

  describe('create()', () => {
    it('should create a Coverage', async () => {
      const expectedInput = {
        data: {
          id: fakeCoverage.id,
          name: fakeCoverage.name,
          description: fakeCoverage.description,
          capital: fakeCoverage.capital,
          premium: fakeCoverage.premium,
          active: fakeCoverage.active,
          createdAt: fakeCoverage.createdAt,
          updatedAt: fakeCoverage.updatedAt,
          deletedAt: fakeCoverage.deletedAt,
        },
      };

      await postgresCoverageRepository.create(fakeCoverage);

      expect(mockedPrismaService.coverage.create).toHaveBeenCalledTimes(1);
      expect(mockedPrismaService.coverage.create).toHaveBeenCalledWith(
        expectedInput,
      );
    });

    it('should throw if PrismaService throws', async () => {
      const expectedError = new Error('create-error');

      mockedPrismaService.coverage.create.mockRejectedValueOnce(expectedError);

      await expect(
        postgresCoverageRepository.create(fakeCoverage),
      ).rejects.toThrow(expectedError);
    });
  });

  describe('findByName()', () => {
    it('should return a Coverage on success', async () => {
      const name = fakeCoverage.name;
      const expectedInput = { where: { name } };
      mockedPrismaService.coverage.findUnique.mockResolvedValue(fakeCoverage);

      const actualCoverage = await postgresCoverageRepository.findByName(name);

      expect(mockedPrismaService.coverage.findUnique).toHaveBeenCalledTimes(1);
      expect(mockedPrismaService.coverage.findUnique).toHaveBeenCalledWith(
        expectedInput,
      );
      expect(actualCoverage).toEqual(fakeCoverage);
    });

    it('should throw if PrismaService throws', async () => {
      const name = fakeCoverage.name;
      const expectedError = new Error('find-error');
      mockedPrismaService.coverage.findUnique.mockRejectedValueOnce(
        expectedError,
      );

      await expect(postgresCoverageRepository.findByName(name)).rejects.toThrow(
        expectedError,
      );
    });
  });

  describe('findById()', () => {
    it('should return a Coverage on success', async () => {
      const id = fakeCoverage.id;
      const expectedInput = { where: { id } };
      mockedPrismaService.coverage.findUnique.mockResolvedValue(fakeCoverage);

      const actualCoverage = await postgresCoverageRepository.findById(id);

      expect(mockedPrismaService.coverage.findUnique).toHaveBeenCalledTimes(1);
      expect(mockedPrismaService.coverage.findUnique).toHaveBeenCalledWith(
        expectedInput,
      );
      expect(actualCoverage).toEqual(fakeCoverage);
    });

    it('should throw if PrismaService throws', async () => {
      const id = fakeCoverage.id;
      const expectedError = new Error('find-error');
      mockedPrismaService.coverage.findUnique.mockRejectedValueOnce(
        expectedError,
      );

      await expect(postgresCoverageRepository.findById(id)).rejects.toThrow(
        expectedError,
      );
    });
  });

  describe('update()', () => {
    it('should update a Coverage', async () => {
      const expectedInput = {
        where: { id: fakeCoverage.id },
        data: {
          id: fakeCoverage.id,
          name: fakeCoverage.name,
          description: fakeCoverage.description,
          capital: fakeCoverage.capital,
          premium: fakeCoverage.premium,
          active: fakeCoverage.active,
          createdAt: fakeCoverage.createdAt,
          updatedAt: fakeCoverage.updatedAt,
          deletedAt: fakeCoverage.deletedAt,
        },
      };
      mockedPrismaService.coverage.findUnique.mockResolvedValueOnce(
        fakeCoverage,
      );

      await postgresCoverageRepository.update(fakeCoverage);

      expect(mockedPrismaService.coverage.update).toHaveBeenCalledTimes(1);
      expect(mockedPrismaService.coverage.update).toHaveBeenCalledWith(
        expectedInput,
      );
    });

    it('should throw if PrismaService throws', async () => {
      const expectedError = new Error('update-error');
      mockedPrismaService.coverage.update.mockRejectedValueOnce(expectedError);

      await expect(
        postgresCoverageRepository.update(fakeCoverage),
      ).rejects.toThrow(expectedError);
    });
  });
});
