import { MockProxy, mock, mockReset } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

import { PostgresUserRepository } from './user';
import { User } from '@domain/entity';

describe('PostgresUserRepository', () => {
  let postgresUserRepository: PostgresUserRepository;
  let mockedPrismaService: any;
  let fakeUser: User;

  beforeAll(() => {
    fakeUser = User.create('aUsername', 'Pass123@');
    mockedPrismaService = mock();
    const userPrismaMock: MockProxy<
      Pick<PrismaClient['user'], 'findUnique' | 'create'>
    > = mock();
    mockedPrismaService['user'] = userPrismaMock;
  });

  beforeEach(() => {
    postgresUserRepository = new PostgresUserRepository(mockedPrismaService);
  });

  afterEach(() => {
    mockReset(mockedPrismaService);
  });

  describe('create()', () => {
    it('should create a User', async () => {
      const expectedInput = {
        data: {
          id: fakeUser.id,
          username: fakeUser.username,
          role: fakeUser.role,
          password: fakeUser.password,
          createdAt: fakeUser.createdAt,
          updatedAt: fakeUser.updatedAt,
        },
      };

      await postgresUserRepository.create(fakeUser);

      expect(mockedPrismaService.user.create).toHaveBeenCalledTimes(1);
      expect(mockedPrismaService.user.create).toHaveBeenCalledWith(
        expectedInput,
      );
    });

    it('should throw if PrismaService throws', async () => {
      const expectedError = new Error('create-error');

      mockedPrismaService.user.create.mockRejectedValueOnce(expectedError);

      await expect(postgresUserRepository.create(fakeUser)).rejects.toThrow(
        expectedError,
      );
    });
  });

  describe('findById()', () => {
    it('should return a User on success', async () => {
      const id = fakeUser.id;
      const expectedInput = { where: { id } };
      mockedPrismaService.user.findUnique.mockResolvedValue(fakeUser);

      const actualUser = await postgresUserRepository.findById(id);

      expect(mockedPrismaService.user.findUnique).toHaveBeenCalledTimes(1);
      expect(mockedPrismaService.user.findUnique).toHaveBeenCalledWith(
        expectedInput,
      );
      expect(actualUser).toEqual(fakeUser);
    });

    it('should throw if PrismaService throws', async () => {
      const id = fakeUser.id;
      const expectedError = new Error('find-error');
      mockedPrismaService.user.findUnique.mockRejectedValueOnce(expectedError);

      await expect(postgresUserRepository.findById(id)).rejects.toThrow(
        expectedError,
      );
    });
  });

  describe('findByUsername()', () => {
    it('should return a User on success', async () => {
      const username = fakeUser.username;
      const expectedInput = { where: { username } };
      mockedPrismaService.user.findUnique.mockResolvedValue(fakeUser);

      const actualUser = await postgresUserRepository.findByUsername(username);

      expect(mockedPrismaService.user.findUnique).toHaveBeenCalledTimes(1);
      expect(mockedPrismaService.user.findUnique).toHaveBeenCalledWith(
        expectedInput,
      );
      expect(actualUser).toEqual(fakeUser);
    });

    it('should throw if PrismaService throws', async () => {
      const username = fakeUser.username;
      const expectedError = new Error('find-error');
      mockedPrismaService.user.findUnique.mockRejectedValueOnce(expectedError);

      await expect(postgresUserRepository.findById(username)).rejects.toThrow(
        expectedError,
      );
    });
  });

  describe('update()', () => {
    it('should update a user', async () => {
      const expectedInput = {
        where: { id: fakeUser.id },
        data: {
          username: fakeUser.username,
          role: fakeUser.role,
          password: fakeUser.password,
          updatedAt: fakeUser.updatedAt,
          createdAt: fakeUser.createdAt,
        },
      };
      mockedPrismaService.user.findUnique.mockResolvedValueOnce(fakeUser);

      await postgresUserRepository.update(fakeUser);

      expect(mockedPrismaService.user.update).toHaveBeenCalledTimes(1);
      expect(mockedPrismaService.user.update).toHaveBeenCalledWith(
        expectedInput,
      );
    });

    it('should throw if PrismaService throws', async () => {
      const expectedError = new Error('update-error');
      mockedPrismaService.user.update.mockRejectedValueOnce(expectedError);

      await expect(postgresUserRepository.update(fakeUser)).rejects.toThrow(
        expectedError,
      );
    });
  });
});
