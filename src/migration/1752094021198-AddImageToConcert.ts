import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageToConcert1752094021198 implements MigrationInterface {
    name = 'AddImageToConcert1752094021198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "concert" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "concert" ADD "image" bytea`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "concert" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "concert" ADD "image" character varying NOT NULL`);
    }

}
