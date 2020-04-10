import {
    Body,
    Controller,
    Delete,
    Get,
    NotAcceptableException,
    NotFoundException,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { AddProductToCartDto } from './dto/add-product-to-cart.dto';
import { Cart } from './cart';
import { CartService } from './cart.service';
import { PriceService } from '../price/price.service';
import { ProductService } from '../product/product.service';
import { Price } from '../price/price';
import { decimal } from '../helpers';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('cart')
export class CartController {
    constructor(private cartService: CartService, private priceService: PriceService, private productService: ProductService) {}

    @Post()
    @ApiOperation({
        summary: 'Create a cart and returns it',
    })
    @ApiResponse({ status: 201, description: 'Cart has been added.' })
    async createCart(): Promise<Cart> {
        return this.cartService.createCart();
    }

    @Get(':uuid')
    @ApiOperation({
        summary: 'Get the cart or null if cart not found',
    })
    @ApiParam({
        name: 'uuid',
        type: 'string',
    })
    @ApiResponse({ status: 201, description: 'Returns cart or null if no cart.' })
    async getCart(@Param('uuid') uuid: string): Promise<Cart | null> {
        return this.cartService.getCart(uuid);
    }

    @Delete(':uuid')
    @ApiOperation({
        summary: 'Removes the cart and update product qunatities in store',
    })
    @ApiParam({
        name: 'uuid',
        type: 'string',
    })
    @ApiResponse({ status: 201, description: 'Cart has been removed and products are back in store.' })
    async removeCart(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
        await this.cartService.removeCart(uuid);
    }

    @Post(':uuid/product')
    @ApiOperation({
        summary: 'Add product to the cart and decrease product qunatity in store',
    })
    @ApiParam({
        name: 'uuid',
        type: 'string',
    })
    @ApiBody({
        type: AddProductToCartDto,
    })
    @ApiResponse({ status: 201, description: 'Add product to cart and update qunatity of product in store.' })
    // TODO : sprawdzenie czy taki produkt w ogóle istnieje - validation pipe
    async addProduct(@Body() productData: AddProductToCartDto, @Param('uuid', new ParseUUIDPipe()) uuid: string): Promise<Cart> {
        const { productId, quantity = 1 } = productData;
        return await this.cartService.addProduct(uuid, productId, quantity);
    }

    @Delete(':uuid/product/:productId')
    @ApiOperation({
        summary: 'Removes the product from cart and update product quantity in store',
    })
    @ApiParam({
        name: 'uuid',
        type: 'string',
    })
    @ApiParam({
        name: 'productId',
        type: 'string',
    })
    @ApiResponse({ status: 201, description: 'Product has been removed from cart and added back to store.' })
    async removeProduct(@Param('uuid', new ParseUUIDPipe()) uuid: string, @Param('productId') productId: string): Promise<Cart> {
        await this.cartService.removeCart(uuid);
    }

    @Patch(':uuid/checkout/:currency')
    @ApiOperation({
        summary: 'Recalculate total for cart with provided currency',
    })
    @ApiParam({
        name: 'uuid',
        type: 'string',
    })
    @ApiParam({
        name: 'currency',
        type: 'string',
    })
    @ApiResponse({ status: 201, description: 'Calculation of carts total succesed.' })
    async checkout(@Param('uuid', new ParseUUIDPipe()) uuid: string, @Param('currency') currency: string): Promise<Cart> {
        return this.cartService.checkout(uuid, currency);
    }
}
