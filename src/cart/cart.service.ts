import { Injectable, NotFoundException } from '@nestjs/common';
import { CartModel } from './domain/cart.model';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { v4 as uuid } from 'uuid';
import { ProductModel } from '../product/domain/product.model';
import { ProductService } from '../product/product.service';
import { decimal } from '../helpers';
import { PriceModel } from '../price/model/price.model';
import { PriceService } from '../price/price.service';
import { ProductInCartModel } from '../product/domain/product-in-cart.model';
import { ProductScenario } from '../product/domain/product.scenario';
import { CartDomainService } from './domain/cart-domain.service';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(CartModel) private readonly cartModel: ReturnModelType<typeof CartModel>,
        @InjectModel(ProductInCartModel) private readonly productInCartModel: ReturnModelType<typeof ProductInCartModel>,
        private readonly cartDomainService: CartDomainService,
        private readonly productService: ProductService
    ) {}

    private async _getCart(uuid: string): Promise<DocumentType<CartModel>> {
        const cart = await this.cartModel.findById(uuid).exec();
        if (!cart) {
            throw new NotFoundException(`Cart with uuid ${uuid} doesnt exist`);
        }
        return cart;
    }

    async save(cart?: CartModel): Promise<CartModel> {
        return this.cartModel.create(cart ? cart : { uuid: uuid() });
    }

    async getCart(uuid: string): Promise<CartModel> {
        return this._getCart(uuid);
    }

    async productRetriever(productId): Promise<ProductModel> {
        return this.productService.getProduct(productId);
    }

    async removeCart(cart: CartModel) {
        await this.cartDomainService.removeCart(cart, this.productRetriever);
        await this.cartModel.remove({ uuid: cart.uuid }).exec();
    }

    async addProduct(cart: CartModel, product: ProductModel, quantity: number = 1): Promise<CartModel> {
        await this.cartDomainService.addProduct(cart, product, quantity);
        return this.save(cart);
    }

    async removeProduct(cart: CartModel, product: ProductModel): Promise<CartModel> {
        await this.cartDomainService.removeProduct(cart, product);
        return this.save(cart);
    }

    async checkout(cart: CartModel, currency: string): Promise<CartModel> {
        await this.cartDomainService.checkout(cart, currency);
        // TODO : zapis koszyka
        return cart;
    }
}
