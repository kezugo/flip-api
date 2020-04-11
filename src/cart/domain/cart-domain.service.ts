import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CartModel } from './cart.model';
import { ProductScenario } from '../../product/domain/product.scenario';
import { ProductModel } from '../../product/domain/product.model';
import { decimal } from '../../helpers';
import { PriceService } from '../../price/price.service';

export type ProductRetriever = (productId: string) => Promise<ProductModel>;

@Injectable()
export class CartDomainService {
    constructor(private readonly productDomainService: ProductScenario, private readonly priceService: PriceService) {}

    async addProduct(cart: CartModel, product: ProductModel, quantity: number = 1): Promise<void> {
        await this.productDomainService.updateQuantity(product, quantity * -1);
        cart.addProduct(product, quantity);
    }

    async removeProduct(cart: CartModel, product: ProductModel): Promise<void> {
        const productFromCart = cart.getProductFromCardByProductId(product.id);
        if (!productFromCart) {
            throw new NotFoundException(`Product with id ${product.id} is not in cart ${cart.uuid}`);
        }
        await this.productDomainService.updateQuantity(product, productFromCart.quantity * -1);
        cart.removeProductFromCartByProductId(product.id);
    }

    async checkout(cart: CartModel, currency: string): Promise<void> {
        const totalAmount = await cart.products.reduce(async (acc, product) => {
            const price = await this.priceService.convertPrice(product.price, currency);
            return (await acc) + decimal(product.quantity, 2) * decimal(price.amount, 2);
        }, Promise.resolve(0));
        cart.confirmCheckout(totalAmount, currency);
    }

    async removeCart(cart: CartModel, productRetriever: ProductRetriever): Promise<void> {
        if (!cart.checkout) {
            cart.products.map(async (productInCart) => {
                const product = await productRetriever(productInCart.productId);
                await this.productDomainService.updateQuantity(product, productInCart.quantity);
            });
        }
    }
}
