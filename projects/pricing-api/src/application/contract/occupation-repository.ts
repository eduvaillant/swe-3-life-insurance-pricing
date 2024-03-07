import { Occupation } from '@domain/entity';

export interface FindOccupationByCodeRepository {
  findByCode(code: string, active?: boolean): Promise<Occupation>;
}
