import { HttpModule, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { CartModel } from './__domain__/models/cart.model';
import { ProductInCartModel } from './__domain__/models/product-in-cart.model';
import { ProductModel } from './__domain__/models/product.model';
import { CartController } from './api/cart.controller';
import { ProductController } from './api/product.controller';
import { CartMongoRepository } from './cart/cart-mongo.repository';
import { PriceExchangeRatesApiService } from './price/price-exchange-rates-api.service';
import { ProductMongoRepository } from './product/product-mongo.repository';
import { cartScenarioProvider, priceScenarioProvider, productScenarioProvider } from './scenarios';

@Module({
    imports: [
        HttpModule,
        TypegooseModule.forRoot('mongodb://flip:flip@mongodb/flip', {
            useNewUrlParser: true,
        }),
        TypegooseModule.forFeature([CartModel]),
        TypegooseModule.forFeature([ProductInCartModel]),
        TypegooseModule.forFeature([ProductModel]),
    ],
    controllers: [CartController, ProductController],
    providers: [
        priceScenarioProvider,
        PriceExchangeRatesApiService,
        cartScenarioProvider,
        CartMongoRepository,
        productScenarioProvider,
        ProductMongoRepository,
    ],
})
export class AppModule {}
