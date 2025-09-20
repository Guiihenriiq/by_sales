import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Offer } from './offer.entity';
import { Product } from './product.entity';

@Entity('offer_products')
export class OfferProduct {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: 'offer_id', type: 'uuid' })
  offerId!: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => Offer, offer => offer.offerProducts)
  @JoinColumn({ name: 'offer_id' })
  offer!: Offer;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  private constructor() { }

  static create(offerId: string, productId: string): OfferProduct {
    const offerProduct = new OfferProduct();
    offerProduct.offerId = offerId;
    offerProduct.productId = productId;
    return offerProduct;
  }
}