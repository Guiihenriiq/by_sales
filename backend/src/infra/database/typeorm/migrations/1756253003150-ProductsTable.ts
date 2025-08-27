import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class ProductsTable1756253003150 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // habilita extensão para gerar UUID
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

        await queryRunner.createTable(
            new Table({
                name: "products",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        default: "uuid_generate_v4()", // ✅ gera UUID automático
                    },
                    { name: "name", type: "varchar", isNullable: false },
                    { name: "description", type: "text", isNullable: false },
                    { name: "price", type: "decimal", precision: 10, scale: 2, isNullable: false },
                    { name: "created_at", type: "timestamp", default: "now()" },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("products");
    }
}
