import { prop } from '@typegoose/typegoose';

export class PriceModel {
    constructor(props?: PriceModel) {
        if (props) {
            Object.assign(this, props);
        }
    }

    @prop()
    currency: string;

    @prop()
    amount: number;
}
