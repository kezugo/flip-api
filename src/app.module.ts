import { HttpModule, Module } from '@nestjs/common';
import { CartController } from './cart/cart.controller';
import { ProductService } from './product/product.service';
import { CartService } from './cart/cart.service';
import { PriceService } from './price/price.service';
import { ProductController } from './product/product.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { CartModel } from './cart/domain/cart.model';
import { ProductModel } from './product/domain/product.model';
import { ProductInCartModel } from './product/domain/product-in-cart.model';
import { ProductScenario } from './product/domain/product.scenario';
import { CartDomainService } from './cart/domain/cart-domain.service';

// TODO @Inject('IProductDomainService') productDomainService: ProductScenario
//const productDomainProvider = { provide: 'ProductScenario', useClass: ProductScenario };

@Module({
    imports: [
        HttpModule,
        // TODO : Konfiguracja z plików
        TypegooseModule.forRoot('mongodb://flip:flip@mongodb/flip', {
            useNewUrlParser: true,
        }),
        TypegooseModule.forFeature([CartModel]),
        TypegooseModule.forFeature([ProductInCartModel]),
        TypegooseModule.forFeature([ProductModel]),
    ],
    controllers: [CartController, ProductController],
    providers: [CartService, PriceService, ProductService, ProductScenario, CartDomainService],
})
export class AppModule {}
