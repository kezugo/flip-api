import { EntityId } from '../entities/entity';
import { BaseModel } from './base.model';
import { PriceModel } from './price.model';

export class ProductInCartModel extends BaseModel<ProductInCartModel> {
    readonly productId: EntityId;

    price: PriceModel;

    quantity: number;
}
