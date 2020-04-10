import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { Price } from '../../price/price';
import { ApiProperty } from '@nestjs/swagger';

export class AddProductDto {
    @ApiProperty({
        description: 'Available quantity of product in store',
        minimum: 1,
        default: 1,
    })
    @IsNumber()
    @Min(1)
    quantity: number;

    @ApiProperty({
        description: 'Name of the product',
        required: true,
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Optional description of the product',
        required: false,
    })
    @IsOptional()
    description?: string;

    price: Price;
}
