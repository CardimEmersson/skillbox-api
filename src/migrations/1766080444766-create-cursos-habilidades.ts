import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCursosHabilidades1766080444766 implements MigrationInterface {
    name = 'CreateCursosHabilidades1766080444766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cursos_habilidades" ("curso_id" integer NOT NULL, "habilidade_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_e2cf5a916b30b9279c330cd8d38" PRIMARY KEY ("curso_id", "habilidade_id"))`);
        await queryRunner.query(`ALTER TABLE "cursos_habilidades" ADD CONSTRAINT "FK_a02c55bcff76cd733141c0bb12e" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cursos_habilidades" ADD CONSTRAINT "FK_83eaae9a42ff77bafa326dcbd54" FOREIGN KEY ("habilidade_id") REFERENCES "habilidades"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cursos_habilidades" DROP CONSTRAINT "FK_83eaae9a42ff77bafa326dcbd54"`);
        await queryRunner.query(`ALTER TABLE "cursos_habilidades" DROP CONSTRAINT "FK_a02c55bcff76cd733141c0bb12e"`);
        await queryRunner.query(`DROP TABLE "cursos_habilidades"`);
    }

}
