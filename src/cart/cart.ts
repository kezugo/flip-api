import { ProductInCart } from '../product/product';
import { Price } from '../price/price';
import { prop } from '@typegoose/typegoose';

export class Cart {
    @prop()
    uuid: string;

    @prop()
    products?: ProductInCart[];

    @prop()
    total?: Price;

    @prop()
    checkout?: boolean;
}
