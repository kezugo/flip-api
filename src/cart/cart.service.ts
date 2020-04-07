import { Injectable } from '@nestjs/common';
import { Cart } from './cart';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { v4 as uuid } from 'uuid';
import { Product, ProductInCart } from '../product/product';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart) private readonly cartModel: ReturnModelType<typeof Cart>,
        @InjectModel(ProductInCart) private readonly productInCartModel: ReturnModelType<typeof ProductInCart>
    ) {}

    async createCart(): Promise<Cart> {
        const cart = new this.cartModel({ uuid: uuid() });
        return cart.save();
    }

    async getCart(uuid: string): Promise<Cart | null> {
        return await this.cartModel.findOne({ uuid }).exec();
    }

    removeCart(uuid: string) {
        this.cartModel.remove({ uuid }).exec();
    }

    async addProduct(uuid: string, product: Product, quantity: number): Promise<Cart> {
        const cart = await this.cartModel.findOne({ uuid }).exec();
        console.log(product);
        const {currency, amount} = product.price;
        console.log(amount, currency);
        cart.products.push(new this.productInCartModel({productId: product.id, quantity, price: { amount, currency}}));
        return cart.save();
    }
}
