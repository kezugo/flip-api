import { NotAcceptableException, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { CartModel } from '../../__domain__/models/cart.model';
import { ProductModel } from '../../__domain__/models/product.model';
import { decimal } from '../helpers/decimal';
import { ICartRepository } from '../repositories/cart.repository';
import { PriceScenario } from './price.scenario';
import { ProductScenario } from './product.scenario';

export class CartScenario {
    constructor(
        private readonly repository: ICartRepository,
        private readonly productScenario: ProductScenario,
        private readonly priceScenario: PriceScenario
    ) {}

    async create(): Promise<CartModel> {
        return this.repository.save(
            new CartModel({
                uuid: uuid(),
            })
        );
    }

    private checkIfCartCheckoutPossible(cart: CartModel): void {
        if (cart.alreadyCheckedOut()) {
            throw new NotAcceptableException(`Cart ${cart.uuid} as been already checked out`);
        }
    }

    async getCart(uuid: string): Promise<CartModel> {
        const cart = await this.repository.find({ uuid });
        if (!cart.length) {
            throw new NotFoundException(`Cart with uuid ${uuid} doesnt exist`);
        }
        return cart[0];
    }

    async addProduct(cart: CartModel, product: ProductModel, quantity = 1): Promise<CartModel> {
        this.checkIfCartCheckoutPossible(cart);
        await this.productScenario.updateQuantity(product, quantity * -1);
        cart.addProduct(product, quantity);
        return this.repository.save(cart);
    }

    async removeProduct(cart: CartModel, product: ProductModel): Promise<CartModel> {
        this.checkIfCartCheckoutPossible(cart);
        const productFromCart = cart.getProductFromCartByProductId(product.id);
        if (!productFromCart) {
            throw new NotFoundException(`Product with id ${product.id} is not in cart ${cart.uuid}`);
        }
        await this.productScenario.updateQuantity(product, productFromCart.quantity * -1);
        cart.removeProductFromCartByProductId(product.id);
        return this.repository.save(cart);
    }

    async checkout(cart: CartModel, currency: string): Promise<CartModel> {
        this.checkIfCartCheckoutPossible(cart);
        const totalAmount = await cart.products.reduce(async (acc, product) => {
            const a = product.price.amount? product.price.amount : 0;
            const c = product.price.currency ? product.price.currency : 'EUR';
            const amount = await this.priceScenario.convertPrice(a, c, currency);
            return (await acc) + decimal(product.quantity, 2) * decimal(amount, 2);
        }, Promise.resolve(0));
        cart.confirmCheckout(totalAmount, currency);
        return this.repository.save(cart);
    }

    async removeCart(cart: CartModel): Promise<void> {
        if (cart.alreadyCheckedOut()) {
            cart.products.map(async (productInCart) => {
                const product = await this.productScenario.getProduct(productInCart.productId);
                await this.productScenario.updateQuantity(product, productInCart.quantity);
            });
        }
        return this.repository.remove(cart);
    }
}
