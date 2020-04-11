import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddProductToCartDto {
    @ApiProperty({
        description: 'Id of the product to be added to cart',
    })
    @IsNotEmpty()
    readonly productId: string;

    @ApiProperty({
        description: 'Quantity of product to be added to cart',
        minimum: 1,
        default: 1,
    })
    @IsNumber()
    @Min(1)
    readonly quantity: number;
}
