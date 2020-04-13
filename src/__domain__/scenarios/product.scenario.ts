import { NotAcceptableException, NotFoundException } from '@nestjs/common';

import { EntityId } from '../entities/entity';
import { ProductModel } from '../models/product.model';
import { IProductRepository } from '../repositories/product.repository';

export class ProductScenario {
    constructor(private readonly productRepository: IProductRepository) {}

    async updateQuantity(product: ProductModel, quantityChange: number): Promise<ProductModel> {
        if (!product.isUpdateQuantityAcceptable(quantityChange)) {
            throw new NotAcceptableException('Requested product quantity in store is too low');
        }
        product.updateQuantity(quantityChange);
        return this.productRepository.save(product);
    }

    async getProduct(id: EntityId): Promise<ProductModel> {
        const product = await this.productRepository.findById(id as string);
        if (!product) {
            throw new NotFoundException(`Product with id ${id} doesnt exist`);
        }
        return product;
    }

    async getProducts(): Promise<ProductModel[]> {
        return this.productRepository.find();
    }

    async addProduct(data: ProductModel): Promise<ProductModel> {
        return this.productRepository.save(data);
    }
}
