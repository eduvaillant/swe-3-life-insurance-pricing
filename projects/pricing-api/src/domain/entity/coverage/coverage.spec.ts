import { faker } from '@faker-js/faker';

import { Coverage } from './coverage';
import { InvalidCapitalError, InvalidPremiumError } from '@domain/error';

describe('Coverage', () => {
  it('should create a new Coverage', () => {
    const fakeCoverageName = faker.lorem.sentence();
    const fakeCoverageDescription = faker.lorem.paragraph(2);
    const fakeCoverageCapital = 1000;
    const fakeCoveragePremium = 200;

    const actualCoverage = Coverage.create(
      fakeCoverageName,
      fakeCoverageDescription,
      fakeCoverageCapital,
      fakeCoveragePremium,
    );

    expect(actualCoverage.id).toBeDefined();
    expect(actualCoverage.name).toBe(fakeCoverageName);
    expect(actualCoverage.description).toBe(fakeCoverageDescription);
    expect(actualCoverage.capital).toBe(fakeCoverageCapital);
    expect(actualCoverage.premium).toBe(fakeCoveragePremium);
    expect(actualCoverage.active).toBe(true);
    expect(actualCoverage.createdAt).toBeDefined();
    expect(actualCoverage.updatedAt).toBeDefined();
    expect(actualCoverage.deletedAt).not.toBeDefined();
  });

  it('should restore a Coverage', () => {
    const fakeCoverageId = faker.string.uuid();
    const fakeCoverageName = faker.lorem.sentence();
    const fakeCoverageDescription = faker.lorem.paragraph(2);
    const fakeCoverageCapital = 1000;
    const fakeCoveragePremium = 200;
    const fakeActive = true;
    const fakeCreatedAt = new Date();
    const fakeUpdatedAt = new Date();
    const fakeDeletedAt = null;

    const actualCoverage = Coverage.restore(
      fakeCoverageId,
      fakeCoverageName,
      fakeCoverageDescription,
      fakeCoverageCapital,
      fakeCoveragePremium,
      fakeActive,
      fakeCreatedAt,
      fakeUpdatedAt,
      fakeDeletedAt,
    );

    expect(actualCoverage.id).toBeDefined();
    expect(actualCoverage.name).toBe(fakeCoverageName);
    expect(actualCoverage.description).toBe(fakeCoverageDescription);
    expect(actualCoverage.capital).toBe(fakeCoverageCapital);
    expect(actualCoverage.premium).toBe(fakeCoveragePremium);
    expect(actualCoverage.active).toBe(true);
    expect(actualCoverage.createdAt).toBeDefined();
    expect(actualCoverage.updatedAt).toBeDefined();
    expect(actualCoverage.deletedAt).toBeDefined();
  });

  it('should throw if capital is not a multiple of 10', () => {
    const fakeCoverageName = faker.lorem.sentence();
    const fakeCoverageDescription = faker.lorem.paragraph(2);
    const fakeCoverageCapital = 1239;
    const fakeCoveragePremium = 200;

    expect(() =>
      Coverage.create(
        fakeCoverageName,
        fakeCoverageDescription,
        fakeCoverageCapital,
        fakeCoveragePremium,
      ),
    ).toThrow(InvalidCapitalError);
  });

  it('should throw if capital is less than 1000', () => {
    const fakeCoverageName = faker.lorem.sentence();
    const fakeCoverageDescription = faker.lorem.paragraph(2);
    const fakeCoverageCapital = 500;
    const fakeCoveragePremium = 10;

    expect(() =>
      Coverage.create(
        fakeCoverageName,
        fakeCoverageDescription,
        fakeCoverageCapital,
        fakeCoveragePremium,
      ),
    ).toThrow(InvalidCapitalError);
  });

  it('should throw if premium is less than 0', () => {
    const fakeCoverageName = faker.lorem.sentence();
    const fakeCoverageDescription = faker.lorem.paragraph(2);
    const fakeCoverageCapital = 1000;
    const fakeCoveragePremium = -1;

    expect(() =>
      Coverage.create(
        fakeCoverageName,
        fakeCoverageDescription,
        fakeCoverageCapital,
        fakeCoveragePremium,
      ),
    ).toThrow(InvalidPremiumError);
  });

  it('should throw if premium is greater than 30% of capital', () => {
    const fakeCoverageName = faker.lorem.sentence();
    const fakeCoverageDescription = faker.lorem.paragraph(2);
    const fakeCoverageCapital = 1000;
    const fakeCoveragePremium = 301;

    expect(() =>
      Coverage.create(
        fakeCoverageName,
        fakeCoverageDescription,
        fakeCoverageCapital,
        fakeCoveragePremium,
      ),
    ).toThrow(InvalidPremiumError);
  });

  it('should inactivate a Coverage', () => {
    const fakeCoverageName = faker.lorem.sentence();
    const fakeCoverageDescription = faker.lorem.paragraph(2);
    const fakeCoverageCapital = 1000;
    const fakeCoveragePremium = 200;
    const coverage = Coverage.create(
      fakeCoverageName,
      fakeCoverageDescription,
      fakeCoverageCapital,
      fakeCoveragePremium,
    );

    coverage.inactivate();

    expect(coverage.active).toBe(false);
    expect(coverage.deletedAt).toBeDefined();
  });
});
