import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ProductModel } from '../__domain__/models/product.model';
import { ProductScenario } from '../__domain__/scenarios/product.scenario';
import { ProductDto } from '../dto/product.dto';
import { SCENARIOS } from '../scenarios';

@Controller('product')
export class ProductController {
    constructor(@Inject(SCENARIOS.PRODUCT) private readonly domain: ProductScenario) {}

    @Get()
    @ApiOperation({
        summary: 'Returns all products available in store',
    })
    @ApiResponse({ status: 201, description: 'All products available in store.' })
    async getProducts(): Promise<ProductModel[]> {
        return this.domain.getProducts();
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
        return this.domain.addProduct(productData as ProductModel);
    }
}
