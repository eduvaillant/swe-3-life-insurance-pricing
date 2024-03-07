import { MockProxy, mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';

import { InactivateCoverageController } from './inactivate-coverage';
import { InactivateCoverage } from '@application/use-case';

describe('InactivateCoverageController', () => {
  let inactivateCoverageController: InactivateCoverageController;
  let mockedInactivateCoverage: MockProxy<InactivateCoverage>;

  beforeAll(() => {
    mockedInactivateCoverage = mock();
  });

  beforeEach(() => {
    inactivateCoverageController = new InactivateCoverageController(
      mockedInactivateCoverage,
    );
  });

  it('should call InactivateCoverage correctly', async () => {
    const input = {
      coverageId: faker.string.uuid(),
    };

    await inactivateCoverageController.handle({
      coverageId: input.coverageId,
    });

    expect(mockedInactivateCoverage.execute).toHaveBeenCalledTimes(1);
    expect(mockedInactivateCoverage.execute).toHaveBeenCalledWith(input);
  });

  it('should throw if InactivateCoverage throws', async () => {
    const input = {
      coverageId: faker.string.uuid(),
    };
    const expectedError = new Error('inactivate-coverage-error');
    mockedInactivateCoverage.execute.mockRejectedValueOnce(expectedError);

    await expect(inactivateCoverageController.handle(input)).rejects.toThrow(
      expectedError,
    );
  });
});
