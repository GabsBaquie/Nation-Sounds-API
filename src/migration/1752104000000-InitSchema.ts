import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1752104000000 implements MigrationInterface {
  name = "InitSchema1752104000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "day" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_42e726f6b72349f70b25598b50e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "concert" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "performer" character varying NOT NULL, "time" character varying NOT NULL, "location" character varying NOT NULL, "image" bytea, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c96bfb33ee9a95525a3f5269d1f" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "poi" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "type" character varying NOT NULL, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "description" character varying, "category" character varying, "address" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cd39f8194203a7955bbb92161b6" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "security_info" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "urgence" boolean NOT NULL DEFAULT false, "actif" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5453d243a384df83a8450a2ff2f" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'user')`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying(50) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying NOT NULL, "resetToken" character varying(255), "resetTokenExpiration" TIMESTAMP, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f4ca2c1e7c96ae6e8a7cca9df80" UNIQUE ("email", "username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "concert_days_day" ("concertId" integer NOT NULL, "dayId" integer NOT NULL, CONSTRAINT "PK_50e001d406b9b4c9b0f5ae0c444" PRIMARY KEY ("concertId", "dayId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8fb2e32a9caad7c30f6229db20" ON "concert_days_day" ("concertId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_49c1adbab19baf2f43214cbeb1" ON "concert_days_day" ("dayId") `
    );
    await queryRunner.query(
      `ALTER TABLE "concert_days_day" ADD CONSTRAINT "FK_8fb2e32a9caad7c30f6229db208" FOREIGN KEY ("concertId") REFERENCES "concert"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "concert_days_day" ADD CONSTRAINT "FK_49c1adbab19baf2f43214cbeb1c" FOREIGN KEY ("dayId") REFERENCES "day"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "concert_days_day" DROP CONSTRAINT "FK_49c1adbab19baf2f43214cbeb1c"`
    );
    await queryRunner.query(
      `ALTER TABLE "concert_days_day" DROP CONSTRAINT "FK_8fb2e32a9caad7c30f6229db208"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_49c1adbab19baf2f43214cbeb1"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8fb2e32a9caad7c30f6229db20"`
    );
    await queryRunner.query(`DROP TABLE "concert_days_day"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(`DROP TABLE "security_info"`);
    await queryRunner.query(`DROP TABLE "poi"`);
    await queryRunner.query(`DROP TABLE "concert"`);
    await queryRunner.query(`DROP TABLE "day"`);
  }
}
