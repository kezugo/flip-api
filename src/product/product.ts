import { Price } from '../price/price';
import { prop } from '@typegoose/typegoose';

export class ProductInCart {

    @prop()
    productId: string;

    @prop()
    price: Price;

    @prop()
    quantity: number;
}

export class Product {

    @prop() // TODO : jak sie oznacza w modelach id z mongo
    id: string;

    @prop()
    price: Price;

    @prop()
    quantity: number;

    @prop()
    name: string;

    @prop()
    description?: string;
}
