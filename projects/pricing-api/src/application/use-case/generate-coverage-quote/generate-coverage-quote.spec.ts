import * as fs from 'fs';
import { MockProxy, mock } from 'jest-mock-extended';

import {
  FindCoverageByIdRepository,
  FindOccupationByCodeRepository,
} from '@application/contract';
import { Coverage, Occupation } from '@domain/entity';
import { GenerateCoverageQuote } from './generate-coverage-quote';
import {
  CoverageNotFoundError,
  OccupationNotFoundError,
} from '@application/error';
import { faker } from '@faker-js/faker';

jest.mock('fs', () => {
  return {
    readFileSync: jest.fn(),
  };
});

describe('GenerateCoverageQuote', () => {
  let mockedCoverageRepository: MockProxy<FindCoverageByIdRepository>;
  let mockedOccupationRepository: MockProxy<FindOccupationByCodeRepository>;
  let generateCoverageQuote: GenerateCoverageQuote;

  beforeAll(() => {
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify([
        { age: 19, factor: 0.8 },
        { age: 20, factor: 1 },
        { age: 22, factor: 1.25 },
        { age: 30, factor: 1.75 },
        { age: 35, factor: 2 },
        { age: 60, factor: 4 },
      ]),
    );
  });

  beforeEach(() => {
    mockedCoverageRepository = mock();
    mockedOccupationRepository = mock();
    generateCoverageQuote = new GenerateCoverageQuote(
      mockedOccupationRepository,
      mockedCoverageRepository,
    );
  });

  it('should return the correct output on success - with one coverage', async () => {
    const fakeOccupation = Occupation.create(
      'Occupation Name',
      '22222',
      true,
      1.02,
    );
    mockedOccupationRepository.findByCode.mockResolvedValueOnce(fakeOccupation);
    const fakeCoverage = Coverage.create(
      'Coverage Name',
      'Coverage Description',
      15000,
      20,
    );
    mockedCoverageRepository.findById.mockResolvedValueOnce(fakeCoverage);
    const input = {
      age: 25,
      occupationCode: '22222',
      capital: 100000,
      coverageIds: [fakeCoverage.id],
    };
    const expectedOutput = {
      ageFactor: 1.75,
      occupationFactor: 1.02,
      coverages: [{ coverageId: fakeCoverage.id, premium: 249.9 }],
      capital: 100000,
      premium: 249.9,
    };

    const actualOutput = await generateCoverageQuote.execute(input);

    expect(actualOutput).toEqual(expectedOutput);
    expect(mockedCoverageRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockedCoverageRepository.findById).toHaveBeenCalledWith(
      input.coverageIds[0],
    );
    expect(mockedOccupationRepository.findByCode).toHaveBeenCalledTimes(1);
    expect(mockedOccupationRepository.findByCode).toHaveBeenCalledWith(
      input.occupationCode,
    );
  });

  it('should return the correct output on success - with multiple coverages', async () => {
    const fakeOccupation = Occupation.create(
      'Occupation Name',
      '22222',
      true,
      1.02,
    );
    mockedOccupationRepository.findByCode.mockResolvedValueOnce(fakeOccupation);
    const fakeCoverage = Coverage.create(
      'Coverage Name',
      'Coverage Description',
      15000,
      20,
    );
    const fakeCoverage2 = Coverage.create(
      'Coverage Name 2',
      'Coverage Description 2',
      10000,
      10,
    );
    mockedCoverageRepository.findById.mockResolvedValueOnce(fakeCoverage);
    mockedCoverageRepository.findById.mockResolvedValueOnce(fakeCoverage2);
    const input = {
      age: 25,
      occupationCode: '22222',
      capital: 100000,
      coverageIds: [fakeCoverage.id, fakeCoverage2.id],
    };
    const expectedOutput = {
      ageFactor: 1.75,
      occupationFactor: 1.02,
      coverages: [
        { coverageId: fakeCoverage.id, premium: 249.9 },
        { coverageId: fakeCoverage2.id, premium: 178.5 },
      ],
      capital: 100000,
      premium: 428.4,
    };

    const actualOutput = await generateCoverageQuote.execute(input);

    expect(actualOutput).toEqual(expectedOutput);
    expect(mockedCoverageRepository.findById).toHaveBeenCalledTimes(2);
    expect(mockedOccupationRepository.findByCode).toHaveBeenCalledTimes(1);
    expect(mockedOccupationRepository.findByCode).toHaveBeenCalledWith(
      input.occupationCode,
    );
  });

  it('should throw if Occupation was not found', async () => {
    mockedOccupationRepository.findByCode.mockResolvedValueOnce(undefined);
    const fakeCoverage = Coverage.create(
      'Coverage Name',
      'Coverage Description',
      15000,
      20,
    );
    mockedCoverageRepository.findById.mockResolvedValueOnce(fakeCoverage);
    const input = {
      age: 25,
      occupationCode: '22222',
      capital: 100000,
      coverageIds: [fakeCoverage.id],
    };

    await expect(generateCoverageQuote.execute(input)).rejects.toThrow(
      OccupationNotFoundError,
    );
  });

  it('should throw if Coverage was not found', async () => {
    const fakeOccupation = Occupation.create(
      'Occupation Name',
      '22222',
      true,
      1.02,
    );
    mockedOccupationRepository.findByCode.mockResolvedValueOnce(fakeOccupation);
    mockedCoverageRepository.findById.mockResolvedValueOnce(undefined);
    const input = {
      age: 25,
      occupationCode: '22222',
      capital: 100000,
      coverageIds: [faker.string.uuid()],
    };

    await expect(generateCoverageQuote.execute(input)).rejects.toThrow(
      CoverageNotFoundError,
    );
  });

  it('should throw if Coverage is inactive', async () => {
    const fakeOccupation = Occupation.create(
      'Occupation Name',
      '22222',
      true,
      1.02,
    );
    mockedOccupationRepository.findByCode.mockResolvedValueOnce(fakeOccupation);
    const fakeCoverage = Coverage.create(
      'Coverage Name',
      'Coverage Description',
      15000,
      20,
    );
    fakeCoverage.inactivate();
    mockedCoverageRepository.findById.mockResolvedValueOnce(fakeCoverage);
    const input = {
      age: 25,
      occupationCode: '22222',
      capital: 100000,
      coverageIds: [faker.string.uuid()],
    };

    await expect(generateCoverageQuote.execute(input)).rejects.toThrow(
      CoverageNotFoundError,
    );
  });
});
