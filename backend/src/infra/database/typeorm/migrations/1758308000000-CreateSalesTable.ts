import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSalesTable1758308000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE sales_payment_method_enum AS ENUM ('credit_card', 'debit_card', 'pix', 'boleto', 'cash');
        `);
        
        await queryRunner.query(`
            CREATE TYPE sales_status_enum AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
        `);
        
        await queryRunner.query(`
            CREATE TABLE sales (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                total_amount DECIMAL(10,2) NOT NULL,
                installments_count INT NOT NULL DEFAULT 1,
                payment_method sales_payment_method_enum NOT NULL,
                status sales_status_enum NOT NULL DEFAULT 'pending',
                billing_code VARCHAR(50) NOT NULL UNIQUE,
                shipping_address TEXT NOT NULL,
                notes TEXT,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS sales;`);
        await queryRunner.query(`DROP TYPE IF EXISTS sales_status_enum;`);
        await queryRunner.query(`DROP TYPE IF EXISTS sales_payment_method_enum;`);
    }
}