import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNameColumnToUser1745154222727 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" ADD COLUMN "name" VARCHAR(255) NOT NULL DEFAULT ''`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
    }
}
