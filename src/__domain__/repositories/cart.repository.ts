import { CartModel } from '../models/cart.model';
import { IGenericRepository } from './generic.repository';

export type ICartRepository = Omit<IGenericRepository<CartModel>, 'findById'>;
