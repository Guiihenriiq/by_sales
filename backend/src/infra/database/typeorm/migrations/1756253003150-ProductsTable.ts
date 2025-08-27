import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class ProductsTable1756253003150 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

        await queryRunner.createTable(
            new Table({
                name: "products",
                columns: [
                    { name: "id", type: "uuid", isPrimary: true },
                    { name: "name", type: "varchar" },
                    { name: "description", type: "text" },
                    { name: "price", type: "decimal", precision: 10, scale: 2 },
                    { name: "created_at", type: "timestamp", default: "now()" },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("products");
    }
}