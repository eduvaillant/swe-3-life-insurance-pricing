import { MockProxy, mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';

import { GenerateCoverageQuoteController } from './generate-coverage-quote';
import { GenerateCoverageQuote } from '@application/use-case';

describe('GenerateCoverageQuoteController', () => {
  let generateCoverageQuoteController: GenerateCoverageQuoteController;
  let mockedGenerateCoverageQuote: MockProxy<GenerateCoverageQuote>;

  beforeAll(() => {
    mockedGenerateCoverageQuote = mock();
  });

  beforeEach(() => {
    generateCoverageQuoteController = new GenerateCoverageQuoteController(
      mockedGenerateCoverageQuote,
    );
  });

  it('should return the correct output on success', async () => {
    const input = {
      age: 26,
      occupationCode: '223280',
      capital: 100000,
      coverages: `${faker.string.uuid()}`,
    };
    const expectedOutput = {
      data: {
        ageFactor: 1.75,
        occupationFactor: 1.02,
        coverages: [{ coverageId: input.coverages, premium: 249.9 }],
        capital: 100000,
        premium: 249.9,
      },
    };
    mockedGenerateCoverageQuote.execute.mockResolvedValueOnce(
      expectedOutput.data,
    );

    const actualOutput = await generateCoverageQuoteController.handle(input);

    expect(mockedGenerateCoverageQuote.execute).toHaveBeenCalledTimes(1);
    expect(mockedGenerateCoverageQuote.execute).toHaveBeenCalledWith({
      ...input,
      coverageIds: input.coverages,
    });
    expect(actualOutput).toEqual(expectedOutput);
  });

  it('should throw if GenerateCoverageQuote throws', async () => {
    const input = {
      age: 26,
      occupationCode: '223280',
      capital: 100000,
      coverages: `${faker.string.uuid()}`,
    };
    const expectedError = new Error('generate-error');
    mockedGenerateCoverageQuote.execute.mockRejectedValueOnce(expectedError);

    await expect(generateCoverageQuoteController.handle(input)).rejects.toThrow(
      expectedError,
    );
  });
});
