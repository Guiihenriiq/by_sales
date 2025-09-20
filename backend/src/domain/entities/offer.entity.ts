import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { OfferProduct } from './offer-product.entity';

export enum OfferType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount'
}

export enum OfferStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired'
}

type CreateOfferProps = {
  title: string;
  description?: string;
  discountType: OfferType;
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  startDate: Date;
  endDate: Date;
  usageLimit?: number;
  bannerImage?: string;
  status?: OfferStatus;
};

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'discount_type', type: 'enum', enum: OfferType })
  discountType!: OfferType;

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

  @Column({ name: 'usage_limit', type: 'integer', nullable: true })
  usageLimit?: number;

  @Column({ name: 'used_count', type: 'integer', default: 0 })
  usedCount!: number;

  @Column({ type: 'enum', enum: OfferStatus, default: OfferStatus.ACTIVE })
  status!: OfferStatus;

  @Column({ name: 'banner_image', type: 'varchar', length: 500, nullable: true })
  bannerImage?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => OfferProduct, offerProduct => offerProduct.offer)
  offerProducts!: OfferProduct[];

  private constructor() { }

  static create(props: CreateOfferProps): Offer {
    const offer = new Offer();

    if (props.discountValue <= 0) {
      throw new Error('Discount value must be greater than zero.');
    }

    if (props.startDate >= props.endDate) {
      throw new Error('Start date must be before end date.');
    }

    Object.assign(offer, {
      title: props.title,
      description: props.description,
      discountType: props.discountType,
      discountValue: props.discountValue,
      minPurchaseAmount: props.minPurchaseAmount || 0,
      maxDiscountAmount: props.maxDiscountAmount,
      startDate: props.startDate,
      endDate: props.endDate,
      usageLimit: props.usageLimit,
      bannerImage: props.bannerImage,
      status: props.status || OfferStatus.ACTIVE,
      usedCount: 0,
    });

    return offer;
  }

  isActive(): boolean {
    const now = new Date();
    return this.status === OfferStatus.ACTIVE && 
           this.startDate <= now && 
           this.endDate >= now &&
           (!this.usageLimit || this.usedCount < this.usageLimit);
  }

  canBeUsed(): boolean {
    return this.isActive();
  }

  calculateDiscount(amount: number): number {
    if (!this.canBeUsed() || amount < this.minPurchaseAmount) {
      return 0;
    }

    let discount = 0;
    if (this.discountType === OfferType.PERCENTAGE) {
      discount = (amount * this.discountValue) / 100;
    } else {
      discount = this.discountValue;
    }

    if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
      discount = this.maxDiscountAmount;
    }

    return Math.min(discount, amount);
  }
}