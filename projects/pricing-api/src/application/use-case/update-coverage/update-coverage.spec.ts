import * as crypto from 'node:crypto';
import { MockProxy, mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';

import { UpdateCoverage } from './update-coverage';
import {
  UpdateCoverageRepository,
  FindCoverageByIdRepository,
  FindCoverageByNameRepository,
} from '@application/contract';
import { Coverage } from '@domain/entity';
import {
  CoverageAlreadyExistsError,
  CoverageNotFoundError,
} from '@application/error';
import { InvalidCapitalError, InvalidPremiumError } from '@domain/error';

jest.mock('node:crypto', () => {
  return {
    randomUUID: jest.fn(),
  };
});

describe('UpdateCoverage', () => {
  let updateCoverage: UpdateCoverage;
  let mockedCoverageRepository: MockProxy<
    UpdateCoverageRepository &
      FindCoverageByIdRepository &
      FindCoverageByNameRepository
  >;
  let fakeCoverageId: string;

  beforeAll(() => {
    fakeCoverageId = faker.string.uuid();
    (crypto.randomUUID as jest.Mock).mockReturnValue(fakeCoverageId);
  });

  beforeEach(() => {
    mockedCoverageRepository = mock();
    updateCoverage = new UpdateCoverage(mockedCoverageRepository);
  });

  it.each([
    {
      fieldName: 'name',
      value: faker.lorem.sentence(),
    },
    {
      fieldName: 'description',
      value: faker.lorem.paragraph(2),
    },
    {
      fieldName: 'capital',
      value: 10000,
    },
    {
      fieldName: 'premium',
      value: 100,
    },
  ])(
    'should update the coverage when passing a single field - $fieldName',
    async ({ fieldName, value }) => {
      const fakeCoverageName = faker.lorem.sentence();
      const fakeDescription = faker.lorem.paragraph(2);
      const fakeCapital = 1000;
      const fakePremium = 200;
      const fakeCoverage = Coverage.create(
        fakeCoverageName,
        fakeDescription,
        fakeCapital,
        fakePremium,
      );
      mockedCoverageRepository.findById.mockResolvedValueOnce(fakeCoverage);
      const expectedOutput = {
        coverageId: fakeCoverageId,
        name: fakeCoverageName,
        description: fakeDescription,
        capital: fakeCapital,
        premium: fakePremium,
      };
      const input = {
        coverageId: fakeCoverageId,
      };
      input[fieldName] = value;
      expectedOutput[fieldName] = value;

      const actualOutput = await updateCoverage.execute(input);

      expect(actualOutput).toEqual(expectedOutput);
      expect(mockedCoverageRepository.update).toHaveBeenCalledTimes(1);
      expect(mockedCoverageRepository.findById).toHaveBeenCalledTimes(1);
    },
  );

  it('should update the coverage when passing all fields', async () => {
    const fakeCoverageName = faker.lorem.sentence();
    const fakeDescription = faker.lorem.paragraph(2);
    const fakeCapital = 1000;
    const fakePremium = 200;
    const fakeCoverage = Coverage.create(
      faker.lorem.sentence(),
      faker.lorem.paragraph(2),
      3000,
      200,
    );
    mockedCoverageRepository.findById.mockResolvedValueOnce(fakeCoverage);
    const expectedOutput = {
      coverageId: fakeCoverageId,
      name: fakeCoverageName,
      description: fakeDescription,
      capital: fakeCapital,
      premium: fakePremium,
    };
    const input = {
      coverageId: fakeCoverageId,
      name: fakeCoverageName,
      description: fakeDescription,
      capital: fakeCapital,
      premium: fakePremium,
    };

    const actualOutput = await updateCoverage.execute(input);

    expect(actualOutput).toEqual(expectedOutput);
    expect(mockedCoverageRepository.update).toHaveBeenCalledTimes(1);
    expect(mockedCoverageRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should throw if Coverage was not found', async () => {
    const input = {
      coverageId: fakeCoverageId,
      name: faker.lorem.sentence(),
      description: faker.lorem.paragraph(2),
      capital: 1000,
      premium: 200,
    };
    mockedCoverageRepository.findById.mockResolvedValueOnce(undefined);

    await expect(updateCoverage.execute(input)).rejects.toThrow(
      CoverageNotFoundError,
    );
    expect(mockedCoverageRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockedCoverageRepository.findById).toHaveBeenCalledWith(
      fakeCoverageId,
    );
    expect(mockedCoverageRepository.update).not.toHaveBeenCalled();
  });

  it('should throw if there is already a Coverage with inputed name', async () => {
    const fakeCoverageName = faker.lorem.sentence();
    const input = {
      coverageId: fakeCoverageId,
      name: fakeCoverageName,
      description: faker.lorem.paragraph(2),
      capital: 1000,
      premium: 200,
    };
    const fakeCoverage = Coverage.create(
      fakeCoverageName,
      input.description,
      input.capital,
      input.premium,
    );
    mockedCoverageRepository.findById.mockResolvedValueOnce(fakeCoverage);
    mockedCoverageRepository.findByName.mockResolvedValueOnce(fakeCoverage);

    await expect(updateCoverage.execute(input)).rejects.toThrow(
      CoverageAlreadyExistsError,
    );
    expect(mockedCoverageRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockedCoverageRepository.findById).toHaveBeenCalledWith(
      fakeCoverageId,
    );
    expect(mockedCoverageRepository.findByName).toHaveBeenCalledTimes(1);
    expect(mockedCoverageRepository.findByName).toHaveBeenCalledWith(
      fakeCoverageName,
    );
    expect(mockedCoverageRepository.update).not.toHaveBeenCalled();
  });

  it('should throw if premium is invalid', async () => {
    const input = {
      coverageId: fakeCoverageId,
      premium: 30000,
    };
    const fakeCoverage = Coverage.create(
      faker.lorem.sentence(),
      faker.lorem.paragraph(2),
      10000,
      2000,
    );
    mockedCoverageRepository.findById.mockResolvedValueOnce(fakeCoverage);

    await expect(updateCoverage.execute(input)).rejects.toThrow(
      InvalidPremiumError,
    );
  });

  it('should throw if premium is invalid when changing capital', async () => {
    const input = {
      coverageId: fakeCoverageId,
      capital: 1000,
    };
    const fakeCoverage = Coverage.create(
      faker.lorem.sentence(),
      faker.lorem.paragraph(2),
      10000,
      2000,
    );
    mockedCoverageRepository.findById.mockResolvedValueOnce(fakeCoverage);

    await expect(updateCoverage.execute(input)).rejects.toThrow(
      InvalidPremiumError,
    );
  });

  it('should throw if capital is invalid', async () => {
    const input = {
      coverageId: fakeCoverageId,
      capital: 100,
    };
    const fakeCoverage = Coverage.create(
      faker.lorem.sentence(),
      faker.lorem.paragraph(2),
      10000,
      2000,
    );
    mockedCoverageRepository.findById.mockResolvedValueOnce(fakeCoverage);

    await expect(updateCoverage.execute(input)).rejects.toThrow(
      InvalidCapitalError,
    );
  });

  it('should throw if UpdateCoverageRepository throws', async () => {
    const expectedError = new Error('update-error');
    mockedCoverageRepository.update.mockRejectedValueOnce(expectedError);
    const input = {
      coverageId: fakeCoverageId,
      premium: 200,
    };
    const fakeCoverage = Coverage.create(
      faker.lorem.sentence(),
      faker.lorem.paragraph(2),
      10000,
      2000,
    );
    mockedCoverageRepository.findById.mockResolvedValueOnce(fakeCoverage);

    await expect(updateCoverage.execute(input)).rejects.toThrow(expectedError);
  });
});
