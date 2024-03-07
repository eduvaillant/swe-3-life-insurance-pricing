import { Coverage } from '@domain/entity';

export interface CreateCoverageRepository {
  create(coverage: Coverage): Promise<void>;
}

export interface FindCoverageByNameRepository {
  findByName(name: string): Promise<Coverage>;
}

export interface FindCoverageByIdRepository {
  findById(id: string, active?: boolean): Promise<Coverage>;
}

export interface UpdateCoverageRepository {
  update(coverage: Coverage): Promise<void>;
}
