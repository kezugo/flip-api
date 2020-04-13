import { CartModel } from '../models/cart.model';
import { ProductModel } from '../models/product.model';

const validProducts = [
    new ProductModel({
        quantity: 3,
        id: 1,
        price: {
            amount: 10,
            currency: 'EUR',
        },
    }),
    new ProductModel({
        quantity: 99,
        id: 2,
        price: {
            amount: 100,
            currency: 'USD',
        },
    }),
    new ProductModel({
        quantity: 66,
        id: 3,
        price: {
            amount: 10,
            currency: 'PLN',
        },
    }),
];

describe('Cart Model', () => {
    let cart: CartModel;

    beforeEach(() => {
        cart = new CartModel();
        cart.addProduct(validProducts[0], 10);
        cart.addProduct(validProducts[1], 11);
    });

    it('should add products to cart', () => {
        cart.addProduct(validProducts[2], 10);
        expect(cart.products.length).toBe(3);
        expect(cart.products[2].productId).toBe(validProducts[2].id);
        expect(cart.products[2].quantity).toBe(10);
    });

    it('should add already existing product as next product', () => {
        cart.addProduct(validProducts[0], 10);
        expect(cart.products.length).toBe(3);
    });

    it('should get product from cart by id', () => {
        const p = cart.getProductFromCartByProductId(validProducts[0].id);
        expect(p.productId).toBe(validProducts[0].id);
        expect(cart.getProductFromCartByProductId(999)).toBeUndefined();
    });

    it('should remove the product from cart by id', () => {
        cart.removeProductFromCartByProductId(validProducts[0].id);
        expect(cart.products.length).toBe(1);
        expect(cart.products[0].productId).toBe(validProducts[1].id);
    });

    it('should change nothing when removing not existing product', () => {
        cart.removeProductFromCartByProductId(1234566);
        expect(cart.products.length).toBe(2);
    });

    it('should checkout with total', () => {
        expect(cart.alreadyCheckedOut()).toBeFalsy();
        cart.confirmCheckout(111, 'USD');
        expect(cart.alreadyCheckedOut()).toBeTruthy();
        expect(cart.total).toMatchObject({
            amount: 111,
            currency: 'USD',
        });
    });
});
