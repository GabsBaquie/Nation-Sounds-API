// import { MigrationInterface, QueryRunner } from "typeorm";

// export class CreateUserTable1737485572919 implements MigrationInterface {
//     name = 'CreateUserTable1737485572919'

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE \`poi\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
//         await queryRunner.query(`ALTER TABLE \`poi\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
//         await queryRunner.query(`ALTER TABLE \`program\` DROP FOREIGN KEY \`FK_e6af78ec87c7301726cf856a6a1\``);
//         await queryRunner.query(`ALTER TABLE \`program\` CHANGE \`dayId\` \`dayId\` int NULL`);
//         await queryRunner.query(`ALTER TABLE \`poi\` CHANGE \`description\` \`description\` varchar(255) NULL`);
//         await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`resetToken\` \`resetToken\` varchar(255) NULL`);
//         await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`resetTokenExpiration\` \`resetTokenExpiration\` timestamp NULL`);
//         await queryRunner.query(`ALTER TABLE \`program\` ADD CONSTRAINT \`FK_e6af78ec87c7301726cf856a6a1\` FOREIGN KEY (\`dayId\`) REFERENCES \`day\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE \`program\` DROP FOREIGN KEY \`FK_e6af78ec87c7301726cf856a6a1\``);
//         await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`resetTokenExpiration\` \`resetTokenExpiration\` timestamp NULL DEFAULT 'NULL'`);
//         await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`resetToken\` \`resetToken\` varchar(255) NULL DEFAULT 'NULL'`);
//         await queryRunner.query(`ALTER TABLE \`poi\` CHANGE \`description\` \`description\` varchar(255) NULL DEFAULT 'NULL'`);
//         await queryRunner.query(`ALTER TABLE \`program\` CHANGE \`dayId\` \`dayId\` int NULL DEFAULT 'NULL'`);
//         await queryRunner.query(`ALTER TABLE \`program\` ADD CONSTRAINT \`FK_e6af78ec87c7301726cf856a6a1\` FOREIGN KEY (\`dayId\`) REFERENCES \`day\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
//         await queryRunner.query(`ALTER TABLE \`poi\` DROP COLUMN \`updatedAt\``);
//         await queryRunner.query(`ALTER TABLE \`poi\` DROP COLUMN \`createdAt\``);
//     }

// }
