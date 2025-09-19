import { MigrationInterface, QueryRunner } from "typeorm";

export class FixProductsTable1758294633035 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Verificar se as colunas já existem antes de adicionar
        const table = await queryRunner.getTable('products');
        
        if (!table?.findColumnByName('category_id')) {
            await queryRunner.query(`ALTER TABLE "products" ADD "category_id" uuid`);
        }
        
        if (!table?.findColumnByName('stock_quantity')) {
            await queryRunner.query(`ALTER TABLE "products" ADD "stock_quantity" integer NOT NULL DEFAULT 0`);
        }
        
        if (!table?.findColumnByName('images')) {
            await queryRunner.query(`ALTER TABLE "products" ADD "images" text[] NOT NULL DEFAULT '{}'`);
        }
        
        if (!table?.findColumnByName('is_active')) {
            await queryRunner.query(`ALTER TABLE "products" ADD "is_active" boolean NOT NULL DEFAULT true`);
        }
        
        if (!table?.findColumnByName('updated_at')) {
            await queryRunner.query(`ALTER TABLE "products" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        }
        
        // Adicionar foreign key para category se não existir
        const foreignKeys = await queryRunner.query(`
            SELECT constraint_name 
            FROM information_schema.table_constraints 
            WHERE table_name = 'products' 
            AND constraint_type = 'FOREIGN KEY' 
            AND constraint_name LIKE '%category%'
        `);
        
        if (foreignKeys.length === 0) {
            await queryRunner.query(`
                ALTER TABLE "products" 
                ADD CONSTRAINT "FK_products_category" 
                FOREIGN KEY ("category_id") 
                REFERENCES "categories"("id") 
                ON DELETE SET NULL
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "FK_products_category"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN IF EXISTS "updated_at"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN IF EXISTS "is_active"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN IF EXISTS "images"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN IF EXISTS "stock_quantity"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN IF EXISTS "category_id"`);
    }

}
