import { Wishlist } from '../entities/wishlist.entity';

export interface IWishlistRepository {
  create(wishlist: Wishlist): Promise<Wishlist>;
  findByUserId(userId: string): Promise<Wishlist[]>;
  findByUserAndProduct(userId: string, productId: string): Promise<Wishlist | null>;
  delete(userId: string, productId: string): Promise<void>;
  deleteById(id: string): Promise<void>;
}