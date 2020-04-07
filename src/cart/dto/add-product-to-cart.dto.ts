import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class AddProductToCartDto {
    @IsNotEmpty()
    productId: string;

    @IsOptional()
    @IsNumber()
    quantity?: number;
}
