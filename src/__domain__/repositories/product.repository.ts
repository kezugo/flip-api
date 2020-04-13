import { ProductModel } from '../models/product.model';
import { IGenericRepository } from './generic.repository';

export type IProductRepository = Omit<IGenericRepository<ProductModel>, 'remove'>;
