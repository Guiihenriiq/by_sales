import { Cart } from '../entities/cart.entity';

export interface ICartRepository {
  create(cart: Cart): Promise<Cart>;
  findByUserId(userId: string): Promise<Cart[]>;
  findByUserAndProduct(userId: string, productId: string): Promise<Cart | null>;
  update(id: string, cart: Partial<Cart>): Promise<Cart | null>;
  delete(id: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
}