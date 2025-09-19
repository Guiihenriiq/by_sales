import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddEmailVerificationFields1756253003156 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("users", [
            new TableColumn({
                name: "email_verified",
                type: "boolean",
                default: false
            }),
            new TableColumn({
                name: "email_verification_token",
                type: "varchar",
                length: "255",
                isNullable: true
            })
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns("users", ["email_verified", "email_verification_token"]);
    }
}