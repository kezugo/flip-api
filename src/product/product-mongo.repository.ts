import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { ProductModel } from '../__domain__/models/product.model';
import { IProductRepository } from '../__domain__/repositories/product.repository';

@Injectable()
export class ProductMongoRepository implements IProductRepository {
    constructor(@InjectModel(ProductModel) private readonly productModel: ReturnModelType<typeof ProductModel>) {}

    async save(product?: ProductModel): Promise<ProductModel> {
        return this.productModel.create(product);
    }

    async findById(id: string): Promise<ProductModel> {
        return await this.productModel.findById(id).exec();
    }

    async find(query?: { [P in keyof ProductModel]?: ProductModel[P] }): Promise<ProductModel[]> {
        return this.productModel.find(query).exec();
    }
}
