import { EntityId } from '../entities/entity';
import { CartModel } from '../models/cart.model';
import { ProductModel } from '../models/product.model';

export class InMemoryRepository<T> {
    repositoryData: T[];

    constructor(repositoryData: T[]) {
        this.repositoryData = repositoryData;
    }

    async save(item?: T): Promise<T> {
        let index;
        if (item instanceof CartModel) {
            index = (this.repositoryData as any[]).findIndex((i) => i.uuid === item.uuid);
        } else if (item instanceof ProductModel) {
            index = (this.repositoryData as any[]).findIndex((i) => i.id === item.id);
        }
        if (index !== -1) {
            this.repositoryData.splice(index, 1);
        }
        this.repositoryData.push(item);
        return new Promise((resolve) => {
            resolve(item);
        });
    }

    async find(query?: { [P in keyof T]?: T[P] }): Promise<T[]> {
        return new Promise((resolve) => {
            if (!query) {
                resolve(this.repositoryData);
            } else {
                const filtersArray = Object.entries(query);
                const items = this.repositoryData.filter((item: T) =>
                    filtersArray.reduce((acc: boolean, current) => {
                        const [key, value] = current;
                        if (typeof item[key] === 'string') {
                            return acc && (item[key] as string).toUpperCase() === (value as string).toUpperCase();
                        }
                        return acc && item[key] === value;
                    }, true)
                );
                resolve(items);
            }
        });
    }

    async findById(id: EntityId): Promise<T> {
        const index = (this.repositoryData as any[]).findIndex((i) => i.id === id);
        const product = this.repositoryData[index] ? this.repositoryData[index] : null;
        return new Promise((resolve) => resolve(product));
    }

    async remove(item: T): Promise<void> {
        let index;
        if (item instanceof CartModel) {
            index = (this.repositoryData as any[]).findIndex((i) => i.uuid === item.uuid);
        } else if (item instanceof ProductModel) {
            index = (this.repositoryData as any[]).findIndex((i) => i.id === item.id);
        }
        this.repositoryData.splice(index, 1);
        return new Promise((resolve) => resolve());
    }
}
