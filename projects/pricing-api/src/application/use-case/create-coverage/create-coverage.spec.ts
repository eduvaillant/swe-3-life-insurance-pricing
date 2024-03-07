import * as crypto from 'node:crypto';
import { faker } from '@faker-js/faker';
import { MockProxy, mock } from 'jest-mock-extended';

import { CreateCoverage } from './create-coverage';
import {
  CreateCoverageRepository,
  FindCoverageByNameRepository,
} from '@application/contract';
import { CoverageAlreadyExistsError } from '@application/error';
import { Coverage } from '@domain/entity';

jest.mock('node:crypto', () => {
  return {
    randomUUID: jest.fn(),
  };
});

describe('CreateCoverage', () => {
  let createCoverage: CreateCoverage;
  let mockedCoverageRepository: MockProxy<
    CreateCoverageRepository & FindCoverageByNameRepository
  >;
  let mockedCoverageId: string;

  beforeAll(() => {
    mockedCoverageId = faker.string.uuid();
    (crypto.randomUUID as jest.Mock).mockReturnValue(mockedCoverageId);
  });

  beforeEach(() => {
    mockedCoverageRepository = mock();
    createCoverage = new CreateCoverage(mockedCoverageRepository);
  });

  it('should return the correct output on success', async () => {
    const fakeName = faker.lorem.sentence();
    const fakeDescription = faker.lorem.paragraph(2);
    const expectedOutput = {
      coverageId: mockedCoverageId,
      name: fakeName,
      description: fakeDescription,
      capital: 1000,
      premium: 200,
    };
    const input = {
      name: fakeName,
      description: fakeDescription,
      capital: 1000,
      premium: 200,
    };

    const actualOutput = await createCoverage.execute(input);

    expect(actualOutput).toEqual(expectedOutput);
    expect(mockedCoverageRepository.create).toHaveBeenCalledTimes(1);
    expect(mockedCoverageRepository.findByName).toHaveBeenCalledTimes(1);
  });

  it('should throw if CreateCoverageRepository throws', async () => {
    const expectedError = new Error('save-error');
    mockedCoverageRepository.create.mockRejectedValueOnce(expectedError);
    const input = {
      name: faker.lorem.sentence(),
      description: faker.lorem.paragraph(2),
      capital: 1000,
      premium: 200,
    };

    await expect(createCoverage.execute(input)).rejects.toThrow(expectedError);
  });

  it('should throw if already exists a Coverage with inputed name on database', async () => {
    const input = {
      name: faker.lorem.sentence(),
      description: faker.lorem.paragraph(2),
      capital: 1000,
      premium: 200,
    };
    const fakeCoverage = Coverage.create(
      input.name,
      input.description,
      input.capital,
      input.premium,
    );
    mockedCoverageRepository.findByName.mockResolvedValueOnce(fakeCoverage);

    await expect(createCoverage.execute(input)).rejects.toThrow(
      CoverageAlreadyExistsError,
    );
    expect(mockedCoverageRepository.findByName).toHaveBeenCalledTimes(1);
    expect(mockedCoverageRepository.findByName).toHaveBeenCalledWith(
      input.name,
    );
    expect(mockedCoverageRepository.create).not.toHaveBeenCalled();
  });
});
