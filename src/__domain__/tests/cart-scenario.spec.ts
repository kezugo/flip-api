import { mock } from 'jest-mock-extended';
import { v4 as uuid } from 'uuid';

import { CartModel } from '../models/cart.model';
import { ProductModel } from '../models/product.model';
import { ICartRepository } from '../repositories/cart.repository';
import { CartScenario } from '../scenarios/cart.scenario';
import { PriceScenario } from '../scenarios/price.scenario';
import { ProductScenario } from '../scenarios/product.scenario';
import { InMemoryRepository } from './in-memory.repository';

describe('Cart Scenario', () => {
    const repositoryData: CartModel[] = [];
    let product: ProductModel;

    const inMemory = new InMemoryRepository<CartModel>(repositoryData);

    const cartRepositoryMock = mock<ICartRepository>();
    cartRepositoryMock.save.mockImplementation(inMemory.save.bind(inMemory));
    cartRepositoryMock.find.mockImplementation(inMemory.find.bind(inMemory));
    cartRepositoryMock.remove.mockImplementation(inMemory.remove.bind(inMemory));

    const productScenarioMock = mock<ProductScenario>();
    const priceServiceMock = mock<PriceScenario>();

    const cartScenario = new CartScenario(cartRepositoryMock, productScenarioMock, priceServiceMock);

    beforeEach(() => {
        repositoryData.length = 0;
        product = new ProductModel({
            quantity: 111,
            id: 111,
            name: 'test 111',
            price: {
                currency: 'EUR',
                amount: 111,
            },
        });
    });

    it('should get cart by uuid', async () => {
        const uuidId = uuid();
        const cart = new CartModel({
            uuid: uuidId,
        });
        repositoryData.push(cart);
        const retrievedCart = await cartScenario.getCart(uuidId);
        expect(retrievedCart).toMatchObject(cart);
    });

    it('should throw error when getting cart by not existing uuid', async () => {
        const uuidId = uuid();
        const cart = new CartModel({
            uuid: uuidId,
        });
        repositoryData.push(cart);
        const randomUuid = uuid();
        await expect(cartScenario.getCart(randomUuid)).rejects.toThrow();
    });

    it('should add new cart', async () => {
        const cart = await cartScenario.create();
        expect(repositoryData.length).toBe(1);
        const retrievedCart = await cartScenario.getCart(cart.uuid);
        expect(retrievedCart).toMatchObject(cart);
    });

    it('should remove cart', async () => {
        const cart = await cartScenario.create();
        expect(repositoryData.length).toBe(1);
        const retrievedCart = await cartScenario.getCart(cart.uuid);
        expect(retrievedCart).toMatchObject(cart);
        await cartScenario.removeCart(cart);
        expect(repositoryData.length).toBe(0);
    });

    it('should add product to cart if cart not checked out', async () => {
        const cart = await cartScenario.create();
        await cartScenario.addProduct(cart, product, 10);
        expect(productScenarioMock.updateQuantity).toHaveBeenCalled();
        const productInCart = cart.getProductFromCartByProductId(product.id);
        expect(productInCart.productId).toBe(product.id);
        expect(productInCart.quantity).toBe(10);
    });

    it('should throw error when adding product to checked out cart', async () => {
        const cart = await cartScenario.create();
        await cartScenario.checkout(cart, 'EUR');
        await expect(cartScenario.addProduct(cart, product, 10)).rejects.toThrow();
    });

    it('should remove product from cart', async () => {
        const cart = await cartScenario.create();
        await cartScenario.addProduct(cart, product);
        expect(repositoryData.length).toBe(1);
        await cartScenario.removeProduct(cart, product);
        expect(productScenarioMock.updateQuantity).toHaveBeenCalled();
        const productsInCart = cart.getProducts();
        expect(productsInCart.length).toBe(0);
        expect(cartRepositoryMock.save).toHaveBeenCalled();
    });

    it('should throw exception when removing product from checked out cart', async () => {
        const cart = await cartScenario.create();
        await cartScenario.addProduct(cart, product);
        await cartScenario.checkout(cart, 'USD');
        await expect(cartScenario.removeProduct(cart, product)).rejects.toThrow();
    });

    it('should throw exception when removing not existing product from cart', async () => {
        const cart = await cartScenario.create();
        await cartScenario.addProduct(cart, product);
        const product2 = new ProductModel({
            id: 99,
            quantity: 99,
            name: 'test 99',
        });
        await expect(cartScenario.removeProduct(cart, product2)).rejects.toThrow();
    });

    it('should checkout cart', async () => {
        const cart = await cartScenario.create();
        await cartScenario.addProduct(cart, product);
        await cartScenario.checkout(cart, 'PLN');
        expect(priceServiceMock.convertPrice).toHaveBeenCalled();
        expect(cart.alreadyCheckedOut()).toBeTruthy();
    });
});
