import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Product } from './product';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { decimal } from '../helpers';
import { AddProductDto } from './dto/add-product.dto';

@Injectable()
export class ProductService {
    constructor(@InjectModel(Product) private readonly productModel: ReturnModelType<typeof Product>) {}

    private async _getProduct(id: string): Promise<DocumentType<Product>> {
        const product = this.productModel.findById(id).exec();
        if (!product) {
            throw new NotFoundException(`Product with id ${id} doesnt exist`);
        }
        return product;
    }

    async updateQuantity(id: string, quantityChange: number): Promise<Product> {
        const product = await this._getProduct(id);
        if (decimal(product.quantity, 2) < decimal(quantityChange, 2) * -1) {
            throw new NotAcceptableException('Requested product quantity in store is too low');
        }
        product.quantity = decimal(product.quantity, 2) + decimal(quantityChange, 2);
        return product.save();
    }

    async getProduct(id: string): Promise<Product> {
        return this._getProduct(id);
    }

    async getProducts(): Promise<Product[]> {
        return await this.productModel.find().exec();
    }

    async addProduct(data: AddProductDto): Promise<Product> {
        const product = new this.productModel(data);
        return product.save();
    }
}
