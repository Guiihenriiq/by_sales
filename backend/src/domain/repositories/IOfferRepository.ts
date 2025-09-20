import { Offer } from '../entities/offer.entity';

export interface IOfferRepository {
  create(offer: Offer): Promise<Offer>;
  findById(id: string): Promise<Offer | null>;
  findAll(): Promise<Offer[]>;
  findActiveOffers(): Promise<Offer[]>;
  findByProductId(productId: string): Promise<Offer[]>;
  update(id: string, offerData: Partial<Offer>): Promise<Offer | null>;
  delete(id: string): Promise<void>;
  addProductToOffer(offerId: string, productId: string): Promise<void>;
  removeProductFromOffer(offerId: string, productId: string): Promise<void>;
}