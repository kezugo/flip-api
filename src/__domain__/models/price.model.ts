import { BaseModel } from './base.model';
import {prop} from "@typegoose/typegoose";

export class PriceModel extends BaseModel<PriceModel> {

    @prop()
    currency: string;

    @prop()
    amount: number;
}
