import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAddressToPoi1752049883978 implements MigrationInterface {
    name = 'AddAddressToPoi1752049883978'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "poi" ADD "address" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "poi" DROP COLUMN "address"`);
    }

}
