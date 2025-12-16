import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProjetos1765895452530 implements MigrationInterface {
    name = 'CreateProjetos1765895452530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."projetos_tipo_projeto_enum" AS ENUM('aprendizado', 'pessoal', 'profissional', 'colaborativo', 'academico', 'criativo', 'open_source')`);
        await queryRunner.query(`CREATE TABLE "projetos" ("id" SERIAL NOT NULL, "usuario_id" integer NOT NULL, "nome" character varying(150) NOT NULL, "periodo_inicial" date, "periodo_final" date, "tipo_projeto" "public"."projetos_tipo_projeto_enum" NOT NULL DEFAULT 'aprendizado', "descricao" character varying(255), "link" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_fb6b6aed4b30e10b976fe8bdf5b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "projetos" ADD CONSTRAINT "FK_1ef362a8f461abdf9846ca7265a" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projetos" DROP CONSTRAINT "FK_1ef362a8f461abdf9846ca7265a"`);
        await queryRunner.query(`DROP TABLE "projetos"`);
        await queryRunner.query(`DROP TYPE "public"."projetos_tipo_projeto_enum"`);
    }

}
