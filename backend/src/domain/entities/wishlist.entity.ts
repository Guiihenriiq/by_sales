import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity('wishlist')
export class Wishlist {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  private constructor() { }

  static create(userId: string, productId: string): Wishlist {
    const wishlist = new Wishlist();
    wishlist.userId = userId;
    wishlist.productId = productId;
    return wishlist;
  }
}