import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { AddProductToCartDto } from './dto/add-product-to-cart.dto';
import { Cart } from './cart';
import { CartService } from './cart.service';
import { PriceService } from '../price/price.service';
import { ProductService } from '../product/product.service';
import { Price } from '../price/price';
import { decimal } from '../helpers';
import { ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('cart')
export class CartController {
    constructor(private cartService: CartService, private priceService: PriceService, private productService: ProductService) {}

    @Post()
    async createCart(): Promise<Cart> {
        return this.cartService.createCart();
    }

    @Get(':uuid')
    async getCart(@Param('uuid') uuid: string): Promise<Cart> {
        return this.cartService.getCart(uuid);
    }

    @Delete(':uuid')
    @ApiParam({
        name: 'uuid',
        type: 'string',
    })
    async removeCart(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
        const cart = await this.cartService.getCart(uuid);
        if (!cart.checkout) {
            cart.products.map((product) => {
                this.productService.updateQuantity(product.productId, product.quantity);
            });
        }
        this.cartService.removeCart(uuid);
    }

    @Post(':uuid/product')
    @ApiParam({
        name: 'uuid',
        type: 'string',
    })
    @ApiBody({
        // TODO : zeby na swaggerze ładnie była schema
        type: AddProductToCartDto,
    })
    // TODO : sprawdzenie czy taki produkt w ogóle istnieje - validation pipe
    async addProduct(@Body() productData: AddProductToCartDto, @Param('uuid', new ParseUUIDPipe()) uuid: string): Promise<Cart> {
        const { productId, quantity = 1 } = productData;
        const product = await this.productService.getProduct(productId);
        if (product!.quantity < quantity) {
            // TODO : nie mozna dodac do koszyka bo za mala ilosc lub nie ma produktu
        }
        await this.cartService.addProduct(uuid, product, quantity);
        await this.productService.updateQuantity(productId, quantity * -1);
        return await this.cartService.getCart(uuid);
    }

    @Delete(':uuid/product/:productId')
    @ApiParam({
        name: 'uuid',
        type: 'string',
    })
    @ApiParam({
        name: 'productId',
        type: 'string',
    })
    async removeProduct(@Param('uuid', new ParseUUIDPipe()) uuid: string, @Param('productId') productId: string): Promise<Cart> {
        const cart = await this.cartService.getCart(uuid);
        const products = cart.products.filter((product) => product.productId === productId);
        if (products.length) {
            const quantity = products.reduce((acc, curr) => acc + curr.quantity, 0);
            await this.productService.updateQuantity(productId, quantity);
        }
        return cart;
    }

    @Patch(':uuid/:currency')
    @ApiParam({
        name: 'uuid',
        type: 'string',
    })
    @ApiParam({
        name: 'currency',
        type: 'string',
    })
    async checkout(@Param('uuid', new ParseUUIDPipe()) uuid: string, @Param('currency') currency: string): Promise<Cart> {
        const cart = await this.cartService.getCart(uuid);
        const totalAmount = await cart.products.reduce(async (acc, product) => {
            const price = await this.priceService.convertPrice(product.price, currency);
            return await acc + product.quantity * decimal(price.amount, 2);
        }, Promise.resolve(0));
        cart.checkout = true;
        const totalPrice = new Price();
        totalPrice.amount = totalAmount;
        totalPrice.currency = currency;
        cart.total = totalPrice;
        // TODO : zapis koszyka
        return cart;
    }
}
