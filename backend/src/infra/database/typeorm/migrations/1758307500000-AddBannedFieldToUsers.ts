import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddBannedFieldToUsers1758307500000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("users", new TableColumn({
            name: "banned",
            type: "boolean",
            default: false
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "banned");
    }
}