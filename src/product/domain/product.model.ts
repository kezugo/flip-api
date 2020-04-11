import { PriceModel } from '../../price/model/price.model';
import { prop } from '@typegoose/typegoose';
import { decimal } from '../../helpers';

// TODO : dwa modele powinny być jeden dla modelu a drugi dla ORMa - żeby uniknąć @prop()
export class ProductModel {

    readonly id: string;

    @prop()
    price: PriceModel;

    @prop()
    quantity: number;

    @prop()
    name: string;

    @prop()
    description?: string;

    isUpdateQuantityAcceptable(quantity: number): boolean {
        return decimal(this.quantity, 2) < decimal(quantity, 2) * -1;
    }

    updateQuantity(quantityChange: number): ProductModel {
        this.quantity = decimal(this.quantity, 2) + decimal(quantityChange, 2);
        return this;
    }
}
