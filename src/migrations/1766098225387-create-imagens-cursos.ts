import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateImagensCursos1766098225387 implements MigrationInterface {
    name = 'CreateImagensCursos1766098225387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "imagens_cursos" ("id" SERIAL NOT NULL, "curso_id" integer NOT NULL, "imagem_url" character varying(255) NOT NULL, "uploaded_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_3a2f8a68b88aed0a883526f7015" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "imagens_cursos" ADD CONSTRAINT "FK_65e5af2b98cd7a91be31ea95898" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "imagens_cursos" DROP CONSTRAINT "FK_65e5af2b98cd7a91be31ea95898"`);
        await queryRunner.query(`DROP TABLE "imagens_cursos"`);
    }

}
