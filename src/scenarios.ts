import { ICartRepository } from './__domain__/repositories/cart.repository';
import { IProductRepository } from './__domain__/repositories/product.repository';
import { CartScenario } from './__domain__/scenarios/cart.scenario';
import { PriceScenario } from './__domain__/scenarios/price.scenario';
import { ProductScenario } from './__domain__/scenarios/product.scenario';
import { CartMongoRepository } from './cart/cart-mongo.repository';
import { PriceExchangeRatesApiService } from './price/price-exchange-rates-api.service';
import { ProductMongoRepository } from './product/product-mongo.repository';
import {IPriceRepository} from "./__domain__/repositories/price.repository";

export const enum SCENARIOS {
    PRODUCT = 'ProductScenario',
    CART = 'CartScenario',
    PRICE = 'PriceScenario',
}

export const productScenarioProvider = {
    provide: SCENARIOS.PRODUCT,
    useFactory: (repository: IProductRepository) => {
        return new ProductScenario(repository);
    },
    inject: [ProductMongoRepository],
};

export const priceScenarioProvider = {
    provide: SCENARIOS.PRICE,
    useFactory: (repository: IPriceRepository) => {
        return new PriceScenario(repository);
    },
    inject: [PriceExchangeRatesApiService],
};

export const cartScenarioProvider = {
    provide: SCENARIOS.CART,
    useFactory: (
        repository: ICartRepository, //
        productScenario: ProductScenario,
        priceService: PriceScenario
    ) => {
        return new CartScenario(repository, productScenario, priceService);
    },
    inject: [CartMongoRepository, SCENARIOS.PRODUCT, SCENARIOS.PRICE],
};
