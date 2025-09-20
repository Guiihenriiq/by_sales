import { Coupon } from '../entities/coupon.entity';
import { UserCoupon } from '../entities/user-coupon.entity';

export interface ICouponRepository {
  create(coupon: Coupon): Promise<Coupon>;
  findById(id: string): Promise<Coupon | null>;
  findByCode(code: string): Promise<Coupon | null>;
  findAll(): Promise<Coupon[]>;
  findByUserId(userId: string): Promise<Coupon[]>;
  findActiveCoupons(): Promise<Coupon[]>;
  update(id: string, couponData: Partial<Coupon>): Promise<Coupon | null>;
  delete(id: string): Promise<void>;
  
  // User coupon methods
  assignCouponToUser(userId: string, couponId: string): Promise<UserCoupon>;
  findUserCoupons(userId: string): Promise<UserCoupon[]>;
  findUserCouponByCode(userId: string, code: string): Promise<UserCoupon | null>;
  markCouponAsUsed(userCouponId: string, saleId: string): Promise<void>;
}