import { MockProxy, mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';

import { UpdateCoverageController } from './update-coverage';
import { UpdateCoverage } from '@application/use-case';

describe('UpdateCoverageController', () => {
  let updateCoverageController: UpdateCoverageController;
  let mockedUpdateCoverage: MockProxy<UpdateCoverage>;
  let fakeCoverageId: string;
  let fakeCoveragename: string;
  let fakeCoverageDescription: string;
  let fakeCoverageCapital: number;
  let fakeCoveragePremium: number;

  beforeAll(() => {
    mockedUpdateCoverage = mock();
    fakeCoverageId = faker.string.uuid();
    fakeCoveragename = faker.lorem.sentence();
    fakeCoverageDescription = faker.lorem.paragraph(2);
    fakeCoverageCapital = faker.number.float();
    fakeCoveragePremium = faker.number.float();
    mockedUpdateCoverage.execute.mockResolvedValue({
      coverageId: fakeCoverageId,
      name: fakeCoveragename,
      description: fakeCoverageDescription,
      capital: fakeCoverageCapital,
      premium: fakeCoveragePremium,
    });
  });

  beforeEach(() => {
    updateCoverageController = new UpdateCoverageController(
      mockedUpdateCoverage,
    );
  });

  it('should return the correct output on success', async () => {
    const input = {
      name: fakeCoveragename,
      description: fakeCoverageDescription,
      capital: fakeCoverageCapital,
      premium: fakeCoveragePremium,
    };
    const expectedOutput = {
      data: {
        coverageId: fakeCoverageId,
        name: fakeCoveragename,
        description: fakeCoverageDescription,
        capital: fakeCoverageCapital,
        premium: fakeCoveragePremium,
      },
    };

    const actualOutput = await updateCoverageController.handle(input, {
      coverageId: fakeCoverageId,
    });

    expect(mockedUpdateCoverage.execute).toHaveBeenCalledTimes(1);
    expect(mockedUpdateCoverage.execute).toHaveBeenCalledWith({
      ...input,
      coverageId: fakeCoverageId,
    });
    expect(actualOutput).toEqual(expectedOutput);
  });

  it('should throw if UpdateCoverage throws', async () => {
    const input = {
      name: fakeCoveragename,
      description: fakeCoverageDescription,
      capital: fakeCoverageCapital,
      premium: fakeCoveragePremium,
    };
    const expectedError = new Error('update-coverage-error');
    mockedUpdateCoverage.execute.mockRejectedValueOnce(expectedError);

    await expect(
      updateCoverageController.handle(input, { coverageId: fakeCoverageId }),
    ).rejects.toThrow(expectedError);
  });
});
