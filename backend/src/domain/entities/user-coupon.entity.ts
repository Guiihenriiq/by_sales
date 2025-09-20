import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Coupon } from './coupon.entity';
import { Sale } from './sale.entity';

@Entity('user_coupons')
export class UserCoupon {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'coupon_id', type: 'uuid' })
  couponId!: string;

  @Column({ name: 'used_at', type: 'timestamp', nullable: true })
  usedAt?: Date;

  @Column({ name: 'sale_id', type: 'uuid', nullable: true })
  saleId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Coupon, coupon => coupon.userCoupons)
  @JoinColumn({ name: 'coupon_id' })
  coupon!: Coupon;

  @ManyToOne(() => Sale)
  @JoinColumn({ name: 'sale_id' })
  sale?: Sale;

  private constructor() { }

  static create(userId: string, couponId: string): UserCoupon {
    const userCoupon = new UserCoupon();
    userCoupon.userId = userId;
    userCoupon.couponId = couponId;
    return userCoupon;
  }

  markAsUsed(saleId: string): void {
    this.usedAt = new Date();
    this.saleId = saleId;
  }

  isUsed(): boolean {
    return !!this.usedAt;
  }
}