import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProjetosCursos1766087277410 implements MigrationInterface {
    name = 'CreateProjetosCursos1766087277410'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "projetos_cursos" ("projeto_id" integer NOT NULL, "curso_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_95112b705a11a33298fb4b9f165" PRIMARY KEY ("projeto_id", "curso_id"))`);
        await queryRunner.query(`ALTER TABLE "projetos_cursos" ADD CONSTRAINT "FK_a7f3bb2b5e45690b7f028311d9f" FOREIGN KEY ("projeto_id") REFERENCES "projetos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projetos_cursos" ADD CONSTRAINT "FK_5121ce5e275686fab6970bad94d" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projetos_cursos" DROP CONSTRAINT "FK_5121ce5e275686fab6970bad94d"`);
        await queryRunner.query(`ALTER TABLE "projetos_cursos" DROP CONSTRAINT "FK_a7f3bb2b5e45690b7f028311d9f"`);
        await queryRunner.query(`DROP TABLE "projetos_cursos"`);
    }

}
