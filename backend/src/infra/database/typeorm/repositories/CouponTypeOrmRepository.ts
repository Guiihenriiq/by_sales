import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { Coupon } from '@/domain/entities/coupon.entity';
import { UserCoupon } from '@/domain/entities/user-coupon.entity';
import { ICouponRepository } from '@/domain/repositories/ICouponRepository';

export class CouponTypeOrmRepository implements ICouponRepository {
  private repository: Repository<Coupon>;
  private userCouponRepository: Repository<UserCoupon>;

  constructor() {
    this.repository = AppDataSource.getRepository(Coupon);
    this.userCouponRepository = AppDataSource.getRepository(UserCoupon);
  }

  async create(coupon: Coupon): Promise<Coupon> {
    return await this.repository.save(coupon);
  }

  async findById(id: string): Promise<Coupon | null> {
    return await this.repository.findOne({ 
      where: { id }, 
      relations: ['user'] 
    });
  }

  async findByCode(code: string): Promise<Coupon | null> {
    return await this.repository.findOne({ 
      where: { code: code.toUpperCase() }, 
      relations: ['user'] 
    });
  }

  async findAll(): Promise<Coupon[]> {
    return await this.repository.find({ 
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByUserId(userId: string): Promise<Coupon[]> {
    return await this.repository.find({ 
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async findActiveCoupons(): Promise<Coupon[]> {
    const now = new Date();
    return await this.repository
      .createQueryBuilder('coupon')
      .leftJoinAndSelect('coupon.user', 'user')
      .where('coupon.status = :status', { status: 'active' })
      .andWhere('coupon.startDate <= :now', { now })
      .andWhere('coupon.endDate >= :now', { now })
      .andWhere('coupon.usedCount < coupon.usageLimit')
      .orderBy('coupon.createdAt', 'DESC')
      .getMany();
  }

  async update(id: string, couponData: Partial<Coupon>): Promise<Coupon | null> {
    await this.repository.update(id, couponData);
    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async assignCouponToUser(userId: string, couponId: string): Promise<UserCoupon> {
    const userCoupon = UserCoupon.create(userId, couponId);
    return await this.userCouponRepository.save(userCoupon);
  }

  async findUserCoupons(userId: string): Promise<UserCoupon[]> {
    return await this.userCouponRepository.find({
      where: { userId },
      relations: ['coupon'],
      order: { createdAt: 'DESC' }
    });
  }

  async findUserCouponByCode(userId: string, code: string): Promise<UserCoupon | null> {
    return await this.userCouponRepository
      .createQueryBuilder('userCoupon')
      .leftJoinAndSelect('userCoupon.coupon', 'coupon')
      .where('userCoupon.userId = :userId', { userId })
      .andWhere('coupon.code = :code', { code: code.toUpperCase() })
      .getOne();
  }

  async markCouponAsUsed(userCouponId: string, saleId: string): Promise<void> {
    const userCoupon = await this.userCouponRepository.findOne({ 
      where: { id: userCouponId },
      relations: ['coupon']
    });
    
    if (userCoupon) {
      userCoupon.markAsUsed(saleId);
      userCoupon.coupon.markAsUsed();
      
      await this.userCouponRepository.save(userCoupon);
      await this.repository.save(userCoupon.coupon);
    }
  }
}