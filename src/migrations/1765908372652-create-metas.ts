import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMetas1765908372652 implements MigrationInterface {
    name = 'CreateMetas1765908372652'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."metas_status_enum" AS ENUM('planejado', 'em andamento', 'concluído')`);
        await queryRunner.query(`CREATE TABLE "metas" ("id" SERIAL NOT NULL, "usuario_id" integer NOT NULL, "nome" character varying(150) NOT NULL, "descricao" character varying(255), "prazo_conclusao" date, "status" "public"."metas_status_enum" NOT NULL DEFAULT 'planejado', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_3a375a83dfcb41b974082b3b1ef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "metas" ADD CONSTRAINT "FK_69b250db7f416272cc91af18671" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "metas" DROP CONSTRAINT "FK_69b250db7f416272cc91af18671"`);
        await queryRunner.query(`DROP TABLE "metas"`);
        await queryRunner.query(`DROP TYPE "public"."metas_status_enum"`);
    }

}
