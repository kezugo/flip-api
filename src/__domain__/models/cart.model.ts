import { prop } from '@typegoose/typegoose';

import { EntityId } from '../entities/entity';
import { BaseModel } from './base.model';
import { PriceModel } from './price.model';
import { ProductInCartModel } from './product-in-cart.model';
import { ProductModel } from './product.model';

export class CartModel extends BaseModel<CartModel> {
    @prop()
    uuid: string;

    @prop()
    products?: ProductInCartModel[] = [];

    @prop()
    total?: PriceModel;

    @prop()
    checkout?: boolean = false;

    removeProductFromCartByProductId(productId: EntityId): CartModel {
        const index = this.products.findIndex((item) => item.productId === productId);
        if (index != -1) {
            this.products.splice(index, 1);
        }
        return this;
    }

    getProductFromCartByProductId(productId: EntityId): ProductInCartModel | undefined {
        return this.products.find((item) => item.productId === productId);
    }

    getProducts(): ProductInCartModel[] {
        return this.products;
    }

    addProduct(product: ProductModel, quantity: number): ProductInCartModel {
        const productInCart = new ProductInCartModel({
            productId: product.id,
            quantity,
            price: { amount: product.price.amount, currency: product.price.currency },
        });
        this.products.push(productInCart);
        return productInCart;
    }

    confirmCheckout(total: number, currency: string): CartModel {
        this.checkout = true;
        this.total = new PriceModel({
            amount: total,
            currency,
        });
        return this;
    }

    alreadyCheckedOut(): boolean {
        return this.checkout;
    }
}
