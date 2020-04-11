import { prop } from '@typegoose/typegoose';
import { PriceModel } from '../../price/model/price.model';

export class ProductInCartModel {
    constructor(props: ProductInCartModel) {
        Object.assign(this, props);
    }

    @prop()
    readonly productId: string;

    @prop()
    price: PriceModel;

    @prop()
    quantity: number;
}
