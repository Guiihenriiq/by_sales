import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInventoryFieldsToProductsTable1758312475692 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "products" 
            ADD COLUMN IF NOT EXISTS "min_stock" integer DEFAULT 0,
            ADD COLUMN IF NOT EXISTS "max_stock" integer DEFAULT 1000,
            ADD COLUMN IF NOT EXISTS "cost_price" decimal(10,2) DEFAULT 0,
            ADD COLUMN IF NOT EXISTS "supplier" varchar(255),
            ADD COLUMN IF NOT EXISTS "barcode" varchar(100),
            ADD COLUMN IF NOT EXISTS "location" varchar(255),
            ADD COLUMN IF NOT EXISTS "last_inventory_date" timestamp,
            ADD COLUMN IF NOT EXISTS "inventory_notes" text
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "products" 
            DROP COLUMN IF EXISTS "min_stock",
            DROP COLUMN IF EXISTS "max_stock",
            DROP COLUMN IF EXISTS "cost_price",
            DROP COLUMN IF EXISTS "supplier",
            DROP COLUMN IF EXISTS "barcode",
            DROP COLUMN IF EXISTS "location",
            DROP COLUMN IF EXISTS "last_inventory_date",
            DROP COLUMN IF EXISTS "inventory_notes"
        `);
    }

}
