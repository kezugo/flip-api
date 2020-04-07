import { Injectable } from '@nestjs/common';
import { Product } from './product';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { decimal } from '../helpers';
import { AddProductDto } from './dto/add-product.dto';

@Injectable()
export class ProductService {
    constructor(@InjectModel(Product) private readonly productModel: ReturnModelType<typeof Product>) {}

    async updateQuantity(id: string, quantityChange: number): Promise<Product> {
        const product = await this.productModel.findById(id).exec();
        product.quantity = decimal(product.quantity, 2) + decimal(quantityChange, 2);
        await product.save();
        return product;
    }

    async getProduct(id: string): Promise<Product | null> {
        return await this.productModel.findById(id).exec();
    }

    async getProducts(): Promise<Product[]> {
        return await this.productModel.find().exec();
    }

    async addProduct(data: AddProductDto): Promise<Product> {
        const product = new this.productModel(data);
        return product.save();
    }
}
