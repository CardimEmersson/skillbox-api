import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHabilidades1765904765391 implements MigrationInterface {
    name = 'CreateHabilidades1765904765391'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."habilidades_nivel_enum" AS ENUM('iniciante', 'intermediário', 'avançado')`);
        await queryRunner.query(`CREATE TABLE "habilidades" ("id" SERIAL NOT NULL, "usuario_id" integer NOT NULL, "icone" character varying(255), "nivel" "public"."habilidades_nivel_enum" NOT NULL DEFAULT 'iniciante', "nome" character varying(100) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_2f85f81d38ab1e59754157813d4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "habilidades" ADD CONSTRAINT "FK_98fbdd3c07ca2599508c916b318" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "habilidades" DROP CONSTRAINT "FK_98fbdd3c07ca2599508c916b318"`);
        await queryRunner.query(`DROP TABLE "habilidades"`);
        await queryRunner.query(`DROP TYPE "public"."habilidades_nivel_enum"`);
    }

}
