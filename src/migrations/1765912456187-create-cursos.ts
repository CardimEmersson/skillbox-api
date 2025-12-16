import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCursos1765912456187 implements MigrationInterface {
    name = 'CreateCursos1765912456187'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cursos" ("id" SERIAL NOT NULL, "usuario_id" integer NOT NULL, "nome" character varying(150) NOT NULL, "plataforma_instituicao" character varying(100), "prazo_conclusao" date, "em_andamento" boolean NOT NULL DEFAULT false, "instructor" character varying(100), "carga_horaria" integer, "link" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_391c5a635ef6b4bd0a46cb75653" PRIMARY KEY ("id")); COMMENT ON COLUMN "cursos"."carga_horaria" IS 'Duração em horas'`);
        await queryRunner.query(`ALTER TABLE "cursos" ADD CONSTRAINT "FK_319104bfd39497c3f0bff6db6e5" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cursos" DROP CONSTRAINT "FK_319104bfd39497c3f0bff6db6e5"`);
        await queryRunner.query(`DROP TABLE "cursos"`);
    }

}
