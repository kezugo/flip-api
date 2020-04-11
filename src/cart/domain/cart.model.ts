import { PriceModel } from '../../price/model/price.model';
import { prop } from '@typegoose/typegoose';
import { ProductInCartModel } from '../../product/domain/product-in-cart.model';
import { ProductModel } from '../../product/domain/product.model';

export class CartModel {
    @prop()
    uuid: string;

    @prop()
    products?: ProductInCartModel[];

    @prop()
    total?: PriceModel;

    @prop()
    checkout?: boolean;

    removeProductFromCartByProductId(productId: string) {
        this.products.splice(
            this.products.findIndex((item) => item.productId === productId),
            1
        );
        return this;
    }

    getProductFromCardByProductId(productId: string): ProductInCartModel | undefined {
        return this.products.find((item) => item.productId === productId);
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

    confirmCheckout(total: number, currency: string) {
        this.checkout = true;
        this.total = new PriceModel({
            amount: total,
            currency,
        });
    }
}
