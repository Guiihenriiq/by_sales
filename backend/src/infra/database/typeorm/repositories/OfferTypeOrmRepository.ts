import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { Offer } from '@/domain/entities/offer.entity';
import { OfferProduct } from '@/domain/entities/offer-product.entity';
import { IOfferRepository } from '@/domain/repositories/IOfferRepository';

export class OfferTypeOrmRepository implements IOfferRepository {
  private repository: Repository<Offer>;
  private offerProductRepository: Repository<OfferProduct>;

  constructor() {
    this.repository = AppDataSource.getRepository(Offer);
    this.offerProductRepository = AppDataSource.getRepository(OfferProduct);
  }

  async create(offer: Offer): Promise<Offer> {
    return await this.repository.save(offer);
  }

  async findById(id: string): Promise<Offer | null> {
    return await this.repository.findOne({ 
      where: { id }, 
      relations: ['offerProducts', 'offerProducts.product'] 
    });
  }

  async findAll(): Promise<Offer[]> {
    return await this.repository.find({ 
      relations: ['offerProducts', 'offerProducts.product'],
      order: { createdAt: 'DESC' }
    });
  }

  async findActiveOffers(): Promise<Offer[]> {
    const now = new Date();
    return await this.repository
      .createQueryBuilder('offer')
      .leftJoinAndSelect('offer.offerProducts', 'offerProducts')
      .leftJoinAndSelect('offerProducts.product', 'product')
      .where('offer.status = :status', { status: 'active' })
      .andWhere('offer.startDate <= :now', { now })
      .andWhere('offer.endDate >= :now', { now })
      .andWhere('(offer.usageLimit IS NULL OR offer.usedCount < offer.usageLimit)')
      .orderBy('offer.createdAt', 'DESC')
      .getMany();
  }

  async findByProductId(productId: string): Promise<Offer[]> {
    const now = new Date();
    return await this.repository
      .createQueryBuilder('offer')
      .leftJoinAndSelect('offer.offerProducts', 'offerProducts')
      .leftJoinAndSelect('offerProducts.product', 'product')
      .where('offerProducts.productId = :productId', { productId })
      .andWhere('offer.status = :status', { status: 'active' })
      .andWhere('offer.startDate <= :now', { now })
      .andWhere('offer.endDate >= :now', { now })
      .andWhere('(offer.usageLimit IS NULL OR offer.usedCount < offer.usageLimit)')
      .orderBy('offer.createdAt', 'DESC')
      .getMany();
  }

  async update(id: string, offerData: Partial<Offer>): Promise<Offer | null> {
    await this.repository.update(id, offerData);
    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async addProductToOffer(offerId: string, productId: string): Promise<void> {
    const offerProduct = OfferProduct.create(offerId, productId);
    await this.offerProductRepository.save(offerProduct);
  }

  async removeProductFromOffer(offerId: string, productId: string): Promise<void> {
    await this.offerProductRepository.delete({ offerId, productId });
  }
}