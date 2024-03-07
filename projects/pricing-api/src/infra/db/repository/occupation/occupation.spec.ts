import { MockProxy, mock, mockReset } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

import { PostgresOccupationRepository } from './occupation';
import { Occupation } from '@domain/entity';

describe('PostgresOccupationRepository', () => {
  let postgresOccupationRepository: PostgresOccupationRepository;
  let mockedPrismaService: any;

  beforeAll(() => {
    mockedPrismaService = mock();
    const occupationPrismaMock: MockProxy<
      Pick<PrismaClient['occupation'], 'findFirst'>
    > = mock();
    mockedPrismaService['occupation'] = occupationPrismaMock;
  });

  beforeEach(() => {
    postgresOccupationRepository = new PostgresOccupationRepository(
      mockedPrismaService,
    );
  });

  afterEach(() => {
    mockReset(mockedPrismaService);
  });

  describe('findByCode()', () => {
    it('should return a Occupation on success', async () => {
      const fakeOccupation = Occupation.create(
        faker.lorem.sentence(),
        '22222',
        true,
        200,
      );
      const code = fakeOccupation.code;
      const expectedInput = { where: { code, active: true } };
      mockedPrismaService.occupation.findFirst.mockResolvedValue(
        fakeOccupation,
      );

      const actualOccupation =
        await postgresOccupationRepository.findByCode(code);

      expect(mockedPrismaService.occupation.findFirst).toHaveBeenCalledTimes(1);
      expect(mockedPrismaService.occupation.findFirst).toHaveBeenCalledWith(
        expectedInput,
      );
      expect(actualOccupation).toEqual(fakeOccupation);
    });

    it('should throw if PrismaService throws', async () => {
      const expectedError = new Error('find-error');
      mockedPrismaService.occupation.findFirst.mockRejectedValueOnce(
        expectedError,
      );

      await expect(
        postgresOccupationRepository.findByCode('22222'),
      ).rejects.toThrow(expectedError);
    });
  });
});
