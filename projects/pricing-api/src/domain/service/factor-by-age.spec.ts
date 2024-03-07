import * as fs from 'fs';
import { FactorByAge } from './factor-by-age';

jest.mock('fs', () => {
  return {
    readFileSync: jest.fn(),
  };
});

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

describe('FactorByAge', () => {
  it.each([
    {
      age: 19,
      expectedFactor: 0.8,
    },
    {
      age: 18,
      expectedFactor: 0.8,
    },
    {
      age: 25,
      expectedFactor: 1.75,
    },
    {
      age: 34,
      expectedFactor: 2,
    },
    {
      age: 39,
      expectedFactor: 4,
    },
  ])(
    'should return the correct factor when passing ages between 18 and 60 - (age = $age)',
    ({ age, expectedFactor }) => {
      const factorByAge = FactorByAge.getInstance();

      const actualFactor = factorByAge.getFactor(age);

      expect(actualFactor).toBe(expectedFactor);
    },
  );

  it.each([{ age: 17 }, { age: 61 }])(
    'should throw if age are less than 18 or greater than 60 - (age = $age)',
    ({ age }) => {
      const factorByAge = FactorByAge.getInstance();

      expect(() => factorByAge.getFactor(age)).toThrow();
    },
  );
});
