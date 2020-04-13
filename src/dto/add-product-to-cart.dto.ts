import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

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
