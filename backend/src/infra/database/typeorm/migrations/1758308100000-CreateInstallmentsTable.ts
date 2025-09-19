import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInstallmentsTable1758308100000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE installments_status_enum AS ENUM ('pending', 'paid', 'overdue', 'cancelled');
        `);
        
        await queryRunner.query(`
            CREATE TABLE installments (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
                installment_number INT NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                due_date DATE NOT NULL,
                paid_date DATE,
                paid_amount DECIMAL(10,2),
                status installments_status_enum NOT NULL DEFAULT 'pending',
                payment_method VARCHAR(50),
                transaction_id VARCHAR(100),
                notes TEXT,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS installments;`);
        await queryRunner.query(`DROP TYPE IF EXISTS installments_status_enum;`);
    }
}