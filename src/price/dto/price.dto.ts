import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PriceDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Currency in which the price is presented',
        required: true,
    })
    currency: string;

    @IsNumber()
    @Min(1)
    @ApiProperty({
        description: 'Amount of money',
        required: true,
    })
    amount: number;
}
