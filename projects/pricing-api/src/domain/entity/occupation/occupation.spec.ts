import { faker } from '@faker-js/faker';

import { Occupation } from './occupation';

describe('Occupation', () => {
  it('should create a new Coverage', () => {
    const fakeOccupationName = faker.lorem.sentence();
    const fakeOccupationCode = '2222';
    const fakeOccupationActive = true;
    const fakeOccupationFactor = 1.11;

    const actualOccupation = Occupation.create(
      fakeOccupationName,
      fakeOccupationCode,
      fakeOccupationActive,
      fakeOccupationFactor,
    );

    expect(actualOccupation.id).toBeDefined();
    expect(actualOccupation.name).toBe(fakeOccupationName);
    expect(actualOccupation.active).toBe(fakeOccupationActive);
    expect(actualOccupation.factor).toBe(fakeOccupationFactor);
    expect(actualOccupation.createdAt).toBeDefined();
  });

  it('should restore a Occupation', () => {
    const fakeOccupationId = faker.string.uuid();
    const fakeOccupationName = faker.lorem.sentence();
    const fakeOccupationCode = '2222';
    const fakeOccupationActive = true;
    const fakeOccupationFactor = 1.11;
    const fakeCreatedAt = new Date();

    const actualOccupation = Occupation.restore(
      fakeOccupationId,
      fakeOccupationName,
      fakeOccupationCode,
      fakeOccupationActive,
      fakeOccupationFactor,
      fakeCreatedAt,
    );

    expect(actualOccupation.id).toBeDefined();
    expect(actualOccupation.name).toBe(fakeOccupationName);
    expect(actualOccupation.active).toBe(fakeOccupationActive);
    expect(actualOccupation.factor).toBe(fakeOccupationFactor);
    expect(actualOccupation.createdAt).toBeDefined();
  });
});
