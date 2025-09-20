import { Request, Response } from 'express';
import { Offer, OfferType, OfferStatus } from '@/domain/entities/offer.entity';
import { OfferTypeOrmRepository } from '@/infra/database/typeorm/repositories/OfferTypeOrmRepository';

export class OfferController {
  async create(req: Request, res: Response) {
    try {
      const { 
        title, description, discountType, discountValue, minPurchaseAmount,
        maxDiscountAmount, startDate, endDate, usageLimit, bannerImage, productIds
      } = req.body;
      
      const offerRepository = new OfferTypeOrmRepository();
      
      const offer = Offer.create({
        title,
        description,
        discountType: discountType as OfferType,
        discountValue: parseFloat(discountValue),
        minPurchaseAmount: minPurchaseAmount ? parseFloat(minPurchaseAmount) : 0,
        maxDiscountAmount: maxDiscountAmount ? parseFloat(maxDiscountAmount) : undefined,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
        bannerImage,
      });
      
      const savedOffer = await offerRepository.create(offer);
      
      // Add products to offer if provided
      if (productIds && Array.isArray(productIds)) {
        for (const productId of productIds) {
          await offerRepository.addProductToOffer(savedOffer.id, productId);
        }
      }
      
      return res.status(201).json(savedOffer);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const offerRepository = new OfferTypeOrmRepository();
      const offers = await offerRepository.findAll();
      
      return res.json(offers);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async findActiveOffers(req: Request, res: Response) {
    try {
      const offerRepository = new OfferTypeOrmRepository();
      const offers = await offerRepository.findActiveOffers();
      
      return res.json(offers);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const offerRepository = new OfferTypeOrmRepository();
      const offer = await offerRepository.findById(id);
      
      if (!offer) {
        return res.status(404).json({ error: 'Offer not found' });
      }
      
      return res.json(offer);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async findByProductId(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      
      const offerRepository = new OfferTypeOrmRepository();
      const offers = await offerRepository.findByProductId(productId);
      
      return res.json(offers);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      if (updateData.startDate) {
        updateData.startDate = new Date(updateData.startDate);
      }
      if (updateData.endDate) {
        updateData.endDate = new Date(updateData.endDate);
      }
      if (updateData.discountValue) {
        updateData.discountValue = parseFloat(updateData.discountValue);
      }
      if (updateData.minPurchaseAmount) {
        updateData.minPurchaseAmount = parseFloat(updateData.minPurchaseAmount);
      }
      if (updateData.maxDiscountAmount) {
        updateData.maxDiscountAmount = parseFloat(updateData.maxDiscountAmount);
      }
      
      const offerRepository = new OfferTypeOrmRepository();
      const offer = await offerRepository.update(id, updateData);
      
      return res.json(offer);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const offerRepository = new OfferTypeOrmRepository();
      await offerRepository.delete(id);
      
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async addProductToOffer(req: Request, res: Response) {
    try {
      const { offerId, productId } = req.params;
      
      const offerRepository = new OfferTypeOrmRepository();
      await offerRepository.addProductToOffer(offerId, productId);
      
      return res.status(200).json({ message: 'Product added to offer successfully' });
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async removeProductFromOffer(req: Request, res: Response) {
    try {
      const { offerId, productId } = req.params;
      
      const offerRepository = new OfferTypeOrmRepository();
      await offerRepository.removeProductFromOffer(offerId, productId);
      
      return res.status(200).json({ message: 'Product removed from offer successfully' });
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }
}