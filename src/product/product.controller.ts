import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product';
import { AddProductDto } from './dto/add-product.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Get()
    async getProducts(): Promise<Product[]> {
        return this.productService.getProducts();
    }

    @Post()
    @ApiBody({
        // TODO : zeby na swaggerze ładnie była schema
        type: AddProductDto,
    })
    async addProduct(@Body() productData: AddProductDto): Promise<Product> {
        return this.productService.addProduct(productData);
    }
}
