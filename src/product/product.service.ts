import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { ProductModel } from './domain/product.model';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { ProductDto } from './dto/product.dto';
import { ProductScenario } from './domain/product.scenario';

@Injectable()
export class ProductService {
    constructor(@InjectModel(ProductModel) private readonly productModel: ReturnModelType<typeof ProductModel>) {}

    async save(product: ProductModel): Promise<ProductModel> {
        return this.productModel.create(product);
    }

    async getProduct(id: string): Promise<ProductModel> {
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new NotFoundException(`Product with id ${id} doesnt exist`);
        }
        return product;
    }

    async getProducts(): Promise<ProductModel[]> {
        return this.productModel.find().exec();
    }

    async addProduct(data: ProductDto): Promise<ProductModel> {
        return this.productModel.create(data);
    }
}
