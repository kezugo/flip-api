import { Injectable } from '@nestjs/common';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { CartModel } from '../__domain__/models/cart.model';
import { ICartRepository } from '../__domain__/repositories/cart.repository';

@Injectable()
export class CartMongoRepository implements ICartRepository {
    constructor(@InjectModel(CartModel) private readonly cartModel: ReturnModelType<typeof CartModel>) {}

    async findById(uuid: string): Promise<DocumentType<CartModel>> {
        return await this.cartModel.findById(uuid).exec();
    }

    async save(cart?: CartModel): Promise<CartModel> {
        return this.cartModel.create(cart);
    }

    async remove(cart: CartModel) {
        await this.cartModel.remove({ uuid: cart.uuid }).exec();
    }

    async find(query?: { [P in keyof CartModel]?: CartModel[P] }): Promise<CartModel[]> {
        return await this.cartModel.find(query).exec();
    }
}
