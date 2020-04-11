import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductModel } from './domain/product.model';
import { ProductDto } from './dto/product.dto';
import { ApiBody, ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Get()
    @ApiOperation({
        summary: 'Returns all products available in store',
    })
    @ApiResponse({ status: 201, description: 'All products available in store.' })
    async getProducts(): Promise<ProductModel[]> {
        return this.productService.getProducts();
    }

    @Post()
    @ApiOperation({
        summary: 'Add product to store',
    })
    @ApiBody({
        type: ProductDto,
    })
    @ApiResponse({ status: 201, description: 'ProductModel has been added to store.' })
    async addProduct(@Body() productData: ProductDto): Promise<ProductModel> {
        return this.productService.addProduct(productData);
    }
}
