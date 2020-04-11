import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { AddProductToCartDto } from './dto/add-product-to-cart.dto';
import { CartModel } from './domain/cart.model';
import { CartService } from './cart.service';
import { PriceService } from '../price/price.service';
import { ProductService } from '../product/product.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('cart')
export class CartController {
    constructor(private cartService: CartService, private priceService: PriceService, private productService: ProductService) {}

    @Post()
    @ApiOperation({
        summary: 'Create a cart and returns it',
    })
    @ApiResponse({ status: 201, description: 'CartModel has been added.' })
    async createCart(): Promise<CartModel> {
        return this.cartService.save();
    }

    @Get(':uuid')
    @ApiOperation({
        summary: 'Get the cart or null if cart not found',
    })
    @ApiParam({
        name: 'uuid',
        description: 'uuid of cart',
        type: 'string',
    })
    @ApiResponse({ status: 201, description: 'Returns cart or null if no cart.' })
    // TODO : @UseFilters catch exception and prepare responses
    async getCart(@Param('uuid') uuid: string): Promise<CartModel | null> {
        return this.cartService.getCart(uuid);
    }

    @Delete(':uuid')
    @ApiOperation({
        summary: 'Removes the cart and update product qunatities in store',
    })
    @ApiParam({
        name: 'uuid',
        description: 'uuid of cart',
        type: 'string',
    })
    @ApiResponse({ status: 201, description: 'CartModel has been removed and products are back in store.' })
    async removeCart(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
        // TODO : Obsługa exception ze nie znaleziono carta ?? dodac info do api
        const cart = await this.cartService.getCart(uuid);
        await this.cartService.removeCart(cart);
    }

    @Post(':uuid/product')
    @ApiOperation({
        summary: 'Add product to the cart and decrease product qunatity in store',
    })
    @ApiParam({
        name: 'uuid',
        description: 'uuid of cart',
        type: 'string',
    })
    @ApiBody({
        type: AddProductToCartDto,
    })
    @ApiResponse({ status: 201, description: 'Add product to cart and update qunatity of product in store.' })
    // TODO : @UseFilters catch exception and prepare responses
    async addProduct(@Body() productData: AddProductToCartDto, @Param('uuid', new ParseUUIDPipe()) uuid: string): Promise<CartModel> {
        const { productId, quantity = 1 } = productData;
        const cart = await this.cartService.getCart(uuid);
        const product = await this.productService.getProduct(productId);
        return this.cartService.addProduct(cart, product, quantity);
    }

    @Delete(':uuid/product/:productId')
    @ApiOperation({
        summary: 'Removes the product from cart and update product quantity in store',
    })
    @ApiParam({
        name: 'uuid',
        description: 'uuid of cart',
        type: 'string',
    })
    @ApiParam({
        name: 'productId',
        description: 'id of the product',
        type: 'string',
    })
    @ApiResponse({ status: 201, description: 'ProductModel has been removed from cart and added back to store.' })
    async removeProduct(@Param('uuid', new ParseUUIDPipe()) uuid: string, @Param('productId') productId: string) {
        const cart = await this.cartService.getCart(uuid);
        const product = await this.productService.getProduct(productId);
        return this.cartService.removeProduct(cart, product);
    }

    @Patch(':uuid/checkout/:currency')
    @ApiOperation({
        summary: 'Recalculate total for cart with provided currency',
    })
    @ApiParam({
        name: 'uuid',
        description: 'uuid of cart',
        type: 'string',
    })
    @ApiParam({
        name: 'currency',
        description: 'symbol of currency',
        type: 'string',
    })
    @ApiResponse({ status: 201, description: 'Calculation of carts total succesed.' })
    async checkout(@Param('uuid', new ParseUUIDPipe()) uuid: string, @Param('currency') currency: string): Promise<CartModel> {
        const cart = await this.cartService.getCart(uuid);
        return this.cartService.checkout(cart, currency);
    }
}
