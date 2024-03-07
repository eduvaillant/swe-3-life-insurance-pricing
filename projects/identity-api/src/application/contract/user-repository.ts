import { User } from '@domain/entity';

export interface CreateUserRepository {
  create(user: User): Promise<void>;
}

export interface FindUserByUsernameRepository {
  findByUsername(username: string): Promise<User>;
}

export interface FindUserByIdRepository {
  findById(id: string): Promise<User>;
}

export interface UpdateUserRepository {
  update(user: User): Promise<void>;
}
