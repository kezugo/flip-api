import { IsNotEmpty, IsNotEmptyObject, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PriceDto } from '../../price/dto/price.dto';

export class ProductDto {
    @ApiProperty({
        description: 'Available quantity of product in store',
        minimum: 1,
        default: 1,
    })
    @IsNumber()
    @Min(1)
    readonly quantity: number;

    @ApiProperty({
        description: 'Name of the product',
        required: true,
    })
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({
        description: 'Optional description of the product',
        required: false,
    })
    @IsOptional()
    readonly description?: string;

    @IsNotEmptyObject()
    @ApiProperty({
        description: 'Price of the product',
        required: true,
    })
    readonly price: PriceDto;
}
