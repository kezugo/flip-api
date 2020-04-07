import { HttpModule, Module } from '@nestjs/common';
import { CartController } from './cart/cart.controller';
import { ProductService } from './product/product.service';
import { CartService } from './cart/cart.service';
import { PriceService } from './price/price.service';
import { ProductController } from './product/product.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Cart } from './cart/cart';
import { Product, ProductInCart } from './product/product';

@Module({
    imports: [
        HttpModule,
        // TODO : Konfiguracja z plików
        TypegooseModule.forRoot('mongodb://flip:flip@mongodb/flip', {
            useNewUrlParser: true,
        }),
        TypegooseModule.forFeature([Cart]),
        TypegooseModule.forFeature([ProductInCart]),
        TypegooseModule.forFeature([Product]),
    ],
    controllers: [CartController, ProductController],
    providers: [CartService, PriceService, ProductService],
})
export class AppModule {}
