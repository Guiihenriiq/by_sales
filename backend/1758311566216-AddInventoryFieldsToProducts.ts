import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInventoryFieldsToProducts1758311566216 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "products" 
            ADD COLUMN "min_stock" integer DEFAULT 0,
            ADD COLUMN "max_stock" integer DEFAULT 1000,
            ADD COLUMN "cost_price" decimal(10,2) DEFAULT 0,
            ADD COLUMN "supplier" varchar(255),
            ADD COLUMN "barcode" varchar(100),
            ADD COLUMN "location" varchar(255),
            ADD COLUMN "last_inventory_date" timestamp,
            ADD COLUMN "inventory_notes" text
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "products" 
            DROP COLUMN "min_stock",
            DROP COLUMN "max_stock",
            DROP COLUMN "cost_price",
            DROP COLUMN "supplier",
            DROP COLUMN "barcode",
            DROP COLUMN "location",
            DROP COLUMN "last_inventory_date",
            DROP COLUMN "inventory_notes"
        `);
    }

}
