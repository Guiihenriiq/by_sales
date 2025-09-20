import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { UserCoupon } from './user-coupon.entity';

export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount'
}

export enum CouponStatus {
  ACTIVE = 'active',
  USED = 'used',
  EXPIRED = 'expired',
  INACTIVE = 'inactive'
}

type CreateCouponProps = {
  code: string;
  title: string;
  description?: string;
  discountType: CouponType;
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  startDate: Date;
  endDate: Date;
  usageLimit?: number;
  userId?: string;
  status?: CouponStatus;
};

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'discount_type', type: 'enum', enum: CouponType })
  discountType!: CouponType;

  @Column({ name: 'discount_value', type: 'decimal', precision: 10, scale: 2 })
  discountValue!: number;

  @Column({ name: 'min_purchase_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  minPurchaseAmount!: number;

  @Column({ name: 'max_discount_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxDiscountAmount?: number;

  @Column({ name: 'start_date', type: 'timestamp' })
  startDate!: Date;

  @Column({ name: 'end_date', type: 'timestamp' })
  endDate!: Date;

  @Column({ name: 'usage_limit', type: 'integer', default: 1 })
  usageLimit!: number;

  @Column({ name: 'used_count', type: 'integer', default: 0 })
  usedCount!: number;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId?: string;

  @Column({ type: 'enum', enum: CouponStatus, default: CouponStatus.ACTIVE })
  status!: CouponStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToMany(() => UserCoupon, userCoupon => userCoupon.coupon)
  userCoupons!: UserCoupon[];

  private constructor() { }

  static create(props: CreateCouponProps): Coupon {
    const coupon = new Coupon();

    if (props.discountValue <= 0) {
      throw new Error('Discount value must be greater than zero.');
    }

    if (props.startDate >= props.endDate) {
      throw new Error('Start date must be before end date.');
    }

    Object.assign(coupon, {
      code: props.code.toUpperCase(),
      title: props.title,
      description: props.description,
      discountType: props.discountType,
      discountValue: props.discountValue,
      minPurchaseAmount: props.minPurchaseAmount || 0,
      maxDiscountAmount: props.maxDiscountAmount,
      startDate: props.startDate,
      endDate: props.endDate,
      usageLimit: props.usageLimit || 1,
      userId: props.userId,
      status: props.status || CouponStatus.ACTIVE,
      usedCount: 0,
    });

    return coupon;
  }

  static generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  isActive(): boolean {
    const now = new Date();
    return this.status === CouponStatus.ACTIVE && 
           this.startDate <= now && 
           this.endDate >= now &&
           this.usedCount < this.usageLimit;
  }

  canBeUsedBy(userId: string): boolean {
    return this.isActive() && (!this.userId || this.userId === userId);
  }

  calculateDiscount(amount: number): number {
    if (!this.isActive() || amount < this.minPurchaseAmount) {
      return 0;
    }

    let discount = 0;
    if (this.discountType === CouponType.PERCENTAGE) {
      discount = (amount * this.discountValue) / 100;
    } else {
      discount = this.discountValue;
    }

    if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
      discount = this.maxDiscountAmount;
    }

    return Math.min(discount, amount);
  }

  markAsUsed(): void {
    this.usedCount += 1;
    if (this.usedCount >= this.usageLimit) {
      this.status = CouponStatus.USED;
    }
  }
}