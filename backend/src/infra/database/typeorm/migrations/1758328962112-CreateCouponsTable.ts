import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCouponsTable1758328962112 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DO $$ BEGIN
                CREATE TYPE coupons_type_enum AS ENUM ('percentage', 'fixed_amount');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        await queryRunner.query(`
            DO $$ BEGIN
                CREATE TYPE coupons_status_enum AS ENUM ('active', 'used', 'expired', 'inactive');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        await queryRunner.query(`
            CREATE TABLE coupons (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                code VARCHAR(50) NOT NULL UNIQUE,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                discount_type coupons_type_enum NOT NULL,
                discount_value DECIMAL(10,2) NOT NULL,
                min_purchase_amount DECIMAL(10,2) DEFAULT 0,
                max_discount_amount DECIMAL(10,2),
                start_date TIMESTAMP NOT NULL,
                end_date TIMESTAMP NOT NULL,
                usage_limit INTEGER DEFAULT 1,
                used_count INTEGER DEFAULT 0,
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                status coupons_status_enum NOT NULL DEFAULT 'active',
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await queryRunner.query(`
            CREATE TABLE user_coupons (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
                used_at TIMESTAMP,
                sale_id UUID REFERENCES sales(id) ON DELETE SET NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, coupon_id)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS user_coupons`);
        await queryRunner.query(`DROP TABLE IF EXISTS coupons`);
        await queryRunner.query(`DROP TYPE IF EXISTS coupons_status_enum`);
        await queryRunner.query(`DROP TYPE IF EXISTS coupons_type_enum`);
    }

}
