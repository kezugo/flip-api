import { mock } from 'jest-mock-extended';

import { PriceModel } from '../models/price.model';
import { ProductModel } from '../models/product.model';
import { IProductRepository } from '../repositories/product.repository';
import { ProductScenario } from '../scenarios/product.scenario';
import { InMemoryRepository } from './in-memory.repository';

const productToBeAdded = new ProductModel({
    id: 1,
    quantity: 99,
    name: 'test1',
    description: 'test1 desc',
    price: new PriceModel({
        amount: 10,
        currency: 'EUR',
    }),
});

describe('Product Scenario', () => {
    const repositoryData: ProductModel[] = [];

    const inMemory = new InMemoryRepository<ProductModel>(repositoryData);
    const productRepositoryMock = mock<IProductRepository>();

    productRepositoryMock.save.mockImplementation(inMemory.save.bind(inMemory));
    productRepositoryMock.find.mockImplementation(inMemory.find.bind(inMemory));
    productRepositoryMock.findById.mockImplementation(inMemory.findById.bind(inMemory));

    const productScenario = new ProductScenario(productRepositoryMock);

    beforeEach(() => {
        repositoryData.length = 0;
    });

    it('should update quantity if quantity valid', async () => {
        repositoryData.push(productToBeAdded);
        const quantityExpected = repositoryData[0].quantity - 10;
        await productScenario.updateQuantity(productToBeAdded, -10);
        expect(productRepositoryMock.save).toHaveBeenCalled();
        expect(repositoryData[0].quantity).toBe(quantityExpected);
    });

    it('should throw exception when updating quantity if quantity is not valid', async () => {
        repositoryData.push(productToBeAdded);
        await expect(productScenario.updateQuantity(productToBeAdded, -1000)).rejects.toThrow();
    });

    it('should get product by id', async () => {
        repositoryData.push(productToBeAdded);
        const product = await productScenario.getProduct(productToBeAdded.id);
        expect(productRepositoryMock.findById).toHaveBeenCalled();
        expect(product.id).toBe(productToBeAdded.id);
    });

    it('should throw exception when getting product by id if product not present', async () => {
        await expect(productScenario.getProduct(productToBeAdded.id)).rejects.toThrow();
    });

    it('should get all products', async () => {
        repositoryData.push(productToBeAdded);
        const products = await productScenario.getProducts();
        expect(productRepositoryMock.find).toHaveBeenCalled();
        expect(products).toEqual(expect.arrayContaining(repositoryData));
    });

    it('should add product', () => {
        productScenario.addProduct(productToBeAdded);
        expect(productRepositoryMock.save).toHaveBeenCalled();
        expect(repositoryData.length).toBe(1);
    });
});
