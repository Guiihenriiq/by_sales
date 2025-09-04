import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class OrderItemsTable1756253003154 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "order_items",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "order_id",
                        type: "uuid"
                    },
                    {
                        name: "product_id",
                        type: "uuid"
                    },
                    {
                        name: "quantity",
                        type: "integer"
                    },
                    {
                        name: "unit_price",
                        type: "decimal",
                        precision: 10,
                        scale: 2
                    },
                    {
                        name: "total_price",
                        type: "decimal",
                        precision: 10,
                        scale: 2
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ["order_id"],
                        referencedTableName: "orders",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE"
                    },
                    {
                        columnNames: ["product_id"],
                        referencedTableName: "products",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE"
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("order_items");
    }
}