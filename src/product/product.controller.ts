import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product';
import { AddProductDto } from './dto/add-product.dto';
import { ApiBody, ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Get()
    @ApiOperation({
        summary: 'Returns all products available in store',
    })
    @ApiResponse({ status: 201, description: 'All products available in store.' })
    async getProducts(): Promise<Product[]> {
        const products = this.productService.getProducts();
        return products;
    }

    @Post()
    @ApiOperation({
        summary: 'Add product to store',
    })
    @ApiBody({
        type: AddProductDto,
    })
    @ApiResponse({ status: 201, description: 'Product has been added to store.' })
    async addProduct(@Body() productData: AddProductDto): Promise<Product> {
        const product = this.productService.addProduct(productData);
        return product;
    }
}
