import { MockProxy, mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';

import { CreateCoverageController } from './create-coverage';
import { CreateCoverage } from '@application/use-case';

describe('CreateCoverageController', () => {
  let createCoverageController: CreateCoverageController;
  let mockedCreateCoverage: MockProxy<CreateCoverage>;
  let fakeCoverageId: string;
  let fakeCoverageName: string;
  let fakeCoverageDescription: string;
  let fakeCoverageCapital: number;
  let fakeCoveragePremium: number;

  beforeAll(() => {
    mockedCreateCoverage = mock();
    fakeCoverageId = faker.string.uuid();
    fakeCoverageName = faker.internet.userName();
    fakeCoverageDescription = 'user';
    fakeCoverageCapital = 1000;
    fakeCoveragePremium = 200;
    mockedCreateCoverage.execute.mockResolvedValue({
      coverageId: fakeCoverageId,
      name: fakeCoverageName,
      description: fakeCoverageDescription,
      capital: fakeCoverageCapital,
      premium: fakeCoveragePremium,
    });
  });

  beforeEach(() => {
    createCoverageController = new CreateCoverageController(
      mockedCreateCoverage,
    );
  });

  it('should return the correct output on success', async () => {
    const input = {
      coverageId: fakeCoverageId,
      name: fakeCoverageName,
      description: fakeCoverageDescription,
      capital: fakeCoverageCapital,
      premium: fakeCoveragePremium,
    };
    const expectedOutput = {
      data: {
        coverageId: fakeCoverageId,
        name: fakeCoverageName,
        description: fakeCoverageDescription,
        capital: fakeCoverageCapital,
        premium: fakeCoveragePremium,
      },
    };

    const actualOutput = await createCoverageController.handle(input);

    expect(mockedCreateCoverage.execute).toHaveBeenCalledTimes(1);
    expect(mockedCreateCoverage.execute).toHaveBeenCalledWith(input);
    expect(actualOutput).toEqual(expectedOutput);
  });

  it('should throw if CreateCoverage throws', async () => {
    const input = {
      coverageId: fakeCoverageId,
      name: fakeCoverageName,
      description: fakeCoverageDescription,
      capital: fakeCoverageCapital,
      premium: fakeCoveragePremium,
    };
    const expectedError = new Error('create-error');
    mockedCreateCoverage.execute.mockRejectedValueOnce(expectedError);

    await expect(createCoverageController.handle(input)).rejects.toThrow(
      expectedError,
    );
  });
});
