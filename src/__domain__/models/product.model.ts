import { prop } from '@typegoose/typegoose';

import { EntityId } from '../entities/entity';
import { decimal } from '../helpers/decimal';
import { BaseModel } from './base.model';
import { PriceModel } from './price.model';

export class ProductModel extends BaseModel<ProductModel> {
    @prop()
    readonly id: EntityId;

    @prop()
    price: PriceModel;

    @prop()
    quantity: number;

    @prop()
    name: string;

    @prop()
    description?: string;

    isUpdateQuantityAcceptable(quantity: number): boolean {
        return decimal(this.quantity, 2) + decimal(quantity, 2) > 0;
    }

    updateQuantity(quantityChange: number): ProductModel {
        this.quantity = decimal(this.quantity, 2) + decimal(quantityChange, 2);
        return this;
    }
}
