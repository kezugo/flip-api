import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Price } from '../../price/price';

export class AddProductDto {
    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    name: string;

    @IsOptional()
    description?: string;

    price: Price;
}
