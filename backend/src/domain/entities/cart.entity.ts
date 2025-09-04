import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

type CreateCartProps = {
  userId: string;
  productId: string;
  quantity?: number;
};

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId!: string;

  @Column({ type: 'integer', default: 1 })
  quantity!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => User, user => user.cartItems)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Product, product => product.cartItems)
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  private constructor() { }

  static create(props: CreateCartProps): Cart {
    const cart = new Cart();

    if (props.quantity && props.quantity <= 0) {
      throw new Error('Quantity must be greater than zero.');
    }

    Object.assign(cart, {
      userId: props.userId,
      productId: props.productId,
      quantity: props.quantity || 1,
    });

    return cart;
  }
}