import * as crypto from 'node:crypto';
import { MockProxy, mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';

import { InactivateCoverage } from './inactivate-coverage';
import {
  UpdateCoverageRepository,
  FindCoverageByIdRepository,
} from '@application/contract';
import { Coverage } from '@domain/entity';
import { CoverageNotFoundError } from '@application/error';

jest.mock('node:crypto', () => {
  return {
    randomUUID: jest.fn(),
  };
});

describe('InactivateCoverage', () => {
  let inactivateCoverage: InactivateCoverage;
  let mockedCoverageRepository: MockProxy<
    UpdateCoverageRepository & FindCoverageByIdRepository
  >;
  let fakeCoverageId: string;

  beforeAll(() => {
    fakeCoverageId = faker.string.uuid();
    (crypto.randomUUID as jest.Mock).mockReturnValue(fakeCoverageId);
  });

  beforeEach(() => {
    mockedCoverageRepository = mock();
    inactivateCoverage = new InactivateCoverage(mockedCoverageRepository);
  });

  it('should call UpdateCoverageRepository with an inactive Coverage', async () => {
    const fakeCoverage = Coverage.create(
      faker.lorem.sentence(),
      faker.lorem.paragraph(2),
      3000,
      200,
    );
    mockedCoverageRepository.findById.mockResolvedValueOnce(fakeCoverage);
    const input = {
      coverageId: fakeCoverageId,
    };

    await inactivateCoverage.execute(input);

    expect(mockedCoverageRepository.update).toHaveBeenCalledTimes(1);
    expect(mockedCoverageRepository.update).toHaveBeenCalledWith(fakeCoverage);
    expect(mockedCoverageRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should throw if Coverage was not found', async () => {
    mockedCoverageRepository.findById.mockResolvedValueOnce(undefined);
    const input = {
      coverageId: fakeCoverageId,
    };

    await expect(inactivateCoverage.execute(input)).rejects.toThrow(
      CoverageNotFoundError,
    );
    expect(mockedCoverageRepository.update).not.toHaveBeenCalled();
  });

  it('should throw if UpdateCoverageRepository throws', async () => {
    const expectedError = new Error('save-error');
    mockedCoverageRepository.update.mockRejectedValueOnce(expectedError);
    mockedCoverageRepository.findById.mockResolvedValueOnce(
      Coverage.create(
        faker.lorem.sentence(),
        faker.lorem.paragraph(2),
        3000,
        300,
      ),
    );
    const input = {
      coverageId: fakeCoverageId,
    };

    await expect(inactivateCoverage.execute(input)).rejects.toThrow(
      expectedError,
    );
  });
});
