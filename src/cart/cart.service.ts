import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart } from './cart';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { v4 as uuid } from 'uuid';
import { Product, ProductInCart } from '../product/product';
import { ProductService } from '../product/product.service';
import { decimal } from '../helpers';
import { Price } from '../price/price';
import { PriceService } from '../price/price.service';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart) private readonly cartModel: ReturnModelType<typeof Cart>,
        @InjectModel(ProductInCart) private readonly productInCartModel: ReturnModelType<typeof ProductInCart>,
        private productService: ProductService,
        private priceService: PriceService
    ) {}

    private async _getCart(uuid: string): Promise<DocumentType<Cart>> {
        const cart = this.cartModel.findById(uuid).exec();
        if (!cart) {
            throw new NotFoundException(`Cart with uuid ${uuid} doesnt exist`);
        }
        return cart;
    }

    async createCart(): Promise<Cart> {
        const cart = new this.cartModel({ uuid: uuid() });
        return cart.save();
    }

    async getCart(uuid: string): Promise<Cart> {
        return this._getCart(uuid);
    }

    async removeCart(uuid: string) {
        const cart = await this._getCart(uuid);
        if (!cart.checkout) {
            cart.products.map((product) => {
                this.productService.updateQuantity(product.productId, product.quantity);
            });
        }
        await this.cartModel.remove({ uuid }).exec();
    }

    async addProduct(uuid: string, productId: string, quantity: number): Promise<Cart> {
        const product = await this.productService.getProduct(productId);
        const cart = await this._getCart(uuid);
        await this.productService.updateQuantity(productId, quantity * -1);
        const { currency, amount } = product.price;
        cart.products.push(
            new this.productInCartModel({
                productId: product.id,
                quantity,
                price: { amount, currency },
            })
        );
        return cart.save();
    }

    async checkout(uuid: string, currency: string): Promise<Cart> {
        const cart = await this._getCart(uuid);
        const totalAmount = await cart.products.reduce(async (acc, product) => {
            const price = await this.priceService.convertPrice(product.price, currency);
            return (await acc) + product.quantity * decimal(price.amount, 2);
        }, Promise.resolve(0));
        cart.checkout = true;
        const totalPrice = new Price();
        totalPrice.amount = totalAmount;
        totalPrice.currency = currency;
        cart.total = totalPrice;
        // TODO : zapis koszyka
        return cart;
    }
}
