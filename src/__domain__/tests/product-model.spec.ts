import { ProductModel } from '../models/product.model';

describe('Product Model', () => {
    const BASE_QUANTITY = 99;

    const product = new ProductModel({
        quantity: BASE_QUANTITY,
    });

    it('should isUpdateQuantityAcceptable() returns false when quantity bigger than available', () => {
        expect(product.isUpdateQuantityAcceptable(-100)).toBe(false);
    });

    it('should isUpdateQuantityAcceptable() returns true when quantity lower than available', () => {
        expect(product.isUpdateQuantityAcceptable(-90)).toBe(true);
    });

    it('should isUpdateQuantityAcceptable() returns true when quantity being added', () => {
        expect(product.isUpdateQuantityAcceptable(90)).toBe(true);
    });

    it('should update quantity stores as property', () => {
        product.updateQuantity(90);
        expect(product.quantity).toBe(BASE_QUANTITY + 90);
    });
});
