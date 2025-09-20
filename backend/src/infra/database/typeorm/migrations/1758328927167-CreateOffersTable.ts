import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOffersTable1758328927167 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DO $$ BEGIN
                CREATE TYPE offers_type_enum AS ENUM ('percentage', 'fixed_amount');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        await queryRunner.query(`
            DO $$ BEGIN
                CREATE TYPE offers_status_enum AS ENUM ('active', 'inactive', 'expired');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        await queryRunner.query(`
            CREATE TABLE offers (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                title VARCHAR(255) NOT NULL,
                description TEXT,
                discount_type offers_type_enum NOT NULL,
                discount_value DECIMAL(10,2) NOT NULL,
                min_purchase_amount DECIMAL(10,2) DEFAULT 0,
                max_discount_amount DECIMAL(10,2),
                start_date TIMESTAMP NOT NULL,
                end_date TIMESTAMP NOT NULL,
                usage_limit INTEGER,
                used_count INTEGER DEFAULT 0,
                status offers_status_enum NOT NULL DEFAULT 'active',
                banner_image VARCHAR(500),
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await queryRunner.query(`
            CREATE TABLE offer_products (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
                product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(offer_id, product_id)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS offer_products`);
        await queryRunner.query(`DROP TABLE IF EXISTS offers`);
        await queryRunner.query(`DROP TYPE IF EXISTS offers_status_enum`);
        await queryRunner.query(`DROP TYPE IF EXISTS offers_type_enum`);
    }

}
