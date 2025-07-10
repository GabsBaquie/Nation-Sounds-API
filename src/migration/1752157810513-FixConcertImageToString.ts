import { MigrationInterface, QueryRunner } from "typeorm";

export class FixConcertImageToString1752157810513 implements MigrationInterface {
    name = 'FixConcertImageToString1752157810513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "concert" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "concert" ADD "image" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "concert" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "concert" ADD "image" bytea`);
    }

}
