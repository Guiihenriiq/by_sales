import { Request, Response } from 'express';
import { Coupon, CouponType, CouponStatus } from '@/domain/entities/coupon.entity';
import { CouponTypeOrmRepository } from '@/infra/database/typeorm/repositories/CouponTypeOrmRepository';

export class CouponController {
  async create(req: Request, res: Response) {
    try {
      const { 
        code, title, description, discountType, discountValue, minPurchaseAmount,
        maxDiscountAmount, startDate, endDate, usageLimit, userId
      } = req.body;
      
      const couponRepository = new CouponTypeOrmRepository();
      
      // Generate code if not provided
      const couponCode = code || Coupon.generateCode();
      
      // Check if code already exists
      const existingCoupon = await couponRepository.findByCode(couponCode);
      if (existingCoupon) {
        return res.status(400).json({ error: 'Coupon code already exists' });
      }
      
      const coupon = Coupon.create({
        code: couponCode,
        title,
        description,
        discountType: discountType as CouponType,
        discountValue: parseFloat(discountValue),
        minPurchaseAmount: minPurchaseAmount ? parseFloat(minPurchaseAmount) : 0,
        maxDiscountAmount: maxDiscountAmount ? parseFloat(maxDiscountAmount) : undefined,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        usageLimit: usageLimit ? parseInt(usageLimit) : 1,
        userId,
      });
      
      const savedCoupon = await couponRepository.create(coupon);
      
      return res.status(201).json(savedCoupon);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const couponRepository = new CouponTypeOrmRepository();
      const coupons = await couponRepository.findAll();
      
      return res.json(coupons);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async findActiveCoupons(req: Request, res: Response) {
    try {
      const couponRepository = new CouponTypeOrmRepository();
      const coupons = await couponRepository.findActiveCoupons();
      
      return res.json(coupons);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const couponRepository = new CouponTypeOrmRepository();
      const coupon = await couponRepository.findById(id);
      
      if (!coupon) {
        return res.status(404).json({ error: 'Coupon not found' });
      }
      
      return res.json(coupon);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async findByCode(req: Request, res: Response) {
    try {
      const { code } = req.params;
      
      const couponRepository = new CouponTypeOrmRepository();
      const coupon = await couponRepository.findByCode(code);
      
      if (!coupon) {
        return res.status(404).json({ error: 'Coupon not found' });
      }
      
      return res.json(coupon);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async validateCoupon(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const { userId, amount } = req.body;
      
      const couponRepository = new CouponTypeOrmRepository();
      const coupon = await couponRepository.findByCode(code);
      
      if (!coupon) {
        return res.status(404).json({ error: 'Coupon not found' });
      }

      if (!coupon.canBeUsedBy(userId)) {
        return res.status(400).json({ error: 'Coupon cannot be used by this user' });
      }

      const discount = coupon.calculateDiscount(amount);
      
      return res.json({
        valid: discount > 0,
        discount,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          title: coupon.title,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          minPurchaseAmount: coupon.minPurchaseAmount
        }
      });
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
      
      const couponRepository = new CouponTypeOrmRepository();
      const coupon = await couponRepository.update(id, updateData);
      
      return res.json(coupon);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const couponRepository = new CouponTypeOrmRepository();
      await couponRepository.delete(id);
      
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async assignCouponToUser(req: Request, res: Response) {
    try {
      const { couponId, userId } = req.params;
      
      const couponRepository = new CouponTypeOrmRepository();
      const userCoupon = await couponRepository.assignCouponToUser(userId, couponId);
      
      return res.status(201).json(userCoupon);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async getUserCoupons(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      const couponRepository = new CouponTypeOrmRepository();
      const userCoupons = await couponRepository.findUserCoupons(userId);
      
      return res.json(userCoupons);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async generateCode(req: Request, res: Response) {
    try {
      const code = Coupon.generateCode();
      return res.json({ code });
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }
}