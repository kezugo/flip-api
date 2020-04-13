import { BaseModel } from './base.model';

export class PriceModel extends BaseModel<PriceModel> {
    currency: string;

    amount: number;
}
