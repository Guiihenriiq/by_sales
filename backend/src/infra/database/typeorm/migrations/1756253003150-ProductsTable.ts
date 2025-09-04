import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class ProductsTable1756253003150 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

        await queryRunner.createTable(
            new Table({
                name: "products",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        default: "uuid_generate_v4()",
                    },
                    { name: "name", type: "varchar", isNullable: false },
                    { name: "description", type: "text", isNullable: false },
                    { name: "price", type: "decimal", precision: 10, scale: 2, isNullable: false },
                    { name: "category_id", type: "uuid", isNullable: true },
                    { name: "stock_quantity", type: "integer", default: 0 },
                    { name: "images", type: "text", array: true, default: "'{}'" },
                    { name: "is_active", type: "boolean", default: true },
                    { name: "created_at", type: "timestamp", default: "now()" },
                    { name: "updated_at", type: "timestamp", default: "now()" },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("products");
    }
}