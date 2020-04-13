import { EntityId } from '../entities/entity';

export interface IGenericRepository<T> {
    save(model?: T): Promise<T>;
    remove(model: T): Promise<void>;
    findById(id: EntityId): Promise<T | null>;
    find(query?: { [P in keyof T]?: T[P] }): Promise<T[]>;
}
