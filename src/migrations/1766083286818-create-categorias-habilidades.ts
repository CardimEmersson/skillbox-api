import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCategoriasHabilidades1766083286818 implements MigrationInterface {
    name = 'CreateCategoriasHabilidades1766083286818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categorias_habilidades" ("categoria_id" integer NOT NULL, "habilidade_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_a1c880d320543d429810de109bd" PRIMARY KEY ("categoria_id", "habilidade_id"))`);
        await queryRunner.query(`ALTER TABLE "categorias_habilidades" ADD CONSTRAINT "FK_7209b2d1f0506171834242cbab9" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categorias_habilidades" ADD CONSTRAINT "FK_7f539842e80aeaf7efadb20bf5f" FOREIGN KEY ("habilidade_id") REFERENCES "habilidades"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categorias_habilidades" DROP CONSTRAINT "FK_7f539842e80aeaf7efadb20bf5f"`);
        await queryRunner.query(`ALTER TABLE "categorias_habilidades" DROP CONSTRAINT "FK_7209b2d1f0506171834242cbab9"`);
        await queryRunner.query(`DROP TABLE "categorias_habilidades"`);
    }

}
