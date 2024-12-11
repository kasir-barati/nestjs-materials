import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1733904053948 implements MigrationInterface {
    name = 'Init1733904053948'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "alert" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(200) NOT NULL,
                "description" character varying(500) NOT NULL,
                "userId" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "alertTypeId" uuid,
                CONSTRAINT "PK_ad91cad659a3536465d564a4b2f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "alert_type" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(200) NOT NULL,
                "description" character varying(500) NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_34f04b83e501fb1bea31e237418" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "alert"
            ADD CONSTRAINT "FK_dedfe4a25d650a6780266ed6493" FOREIGN KEY ("alertTypeId") REFERENCES "alert_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "alert" DROP CONSTRAINT "FK_dedfe4a25d650a6780266ed6493"
        `);
        await queryRunner.query(`
            DROP TABLE "alert_type"
        `);
        await queryRunner.query(`
            DROP TABLE "alert"
        `);
    }

}
