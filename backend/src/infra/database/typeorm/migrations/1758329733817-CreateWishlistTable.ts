import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWishlistTable1758329733817 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE wishlist (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, product_id)
            );
        `);

        await queryRunner.query(`
            CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS idx_wishlist_user_id`);
        await queryRunner.query(`DROP TABLE IF EXISTS wishlist`);
    }

}
