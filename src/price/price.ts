import { prop } from '@typegoose/typegoose';

export class Price {
    @prop()
    currency: string;

    @prop()
    amount: number;
}
