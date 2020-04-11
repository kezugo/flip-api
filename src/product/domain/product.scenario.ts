import { Injectable, NotAcceptableException } from '@nestjs/common';
import { ProductModel } from './product.model';
import { ProductService } from '../product.service';

@Injectable()
export class ProductScenario {
    constructor(private readonly productService: ProductService) {}

    async updateQuantity(product: ProductModel, quantityChange: number): Promise<ProductModel> {
        if (!product.isUpdateQuantityAcceptable(quantityChange)) {
            throw new NotAcceptableException('Requested product quantity in store is too low');
        }
        product.updateQuantity(quantityChange);
        return this.productService.save(product);
    }
}
