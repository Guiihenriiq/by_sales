import { Cart } from '@/domain/entities/cart.entity';
import { ICartRepository } from '@/domain/repositories/ICartRepository';

interface AddToCartRequest {
  userId: string;
  productId: string;
  quantity?: number;
}

export class AddToCartUseCase {
  constructor(private cartRepository: ICartRepository) {}

  async execute({ userId, productId, quantity = 1 }: AddToCartRequest): Promise<Cart> {
    const existingCartItem = await this.cartRepository.findByUserAndProduct(userId, productId);

    if (existingCartItem) {
      const updatedQuantity = existingCartItem.quantity + quantity;
      const updatedCart = await this.cartRepository.update(existingCartItem.id, { quantity: updatedQuantity });
      return updatedCart!;
    }

    const cartItem = Cart.create({ userId, productId, quantity });
    return await this.cartRepository.create(cartItem);
  }
}