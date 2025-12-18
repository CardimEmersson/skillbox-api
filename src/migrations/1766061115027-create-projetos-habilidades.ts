import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProjetosHabilidades1766061115027 implements MigrationInterface {
    name = 'CreateProjetosHabilidades1766061115027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "projetos_habilidades" ("projeto_id" integer NOT NULL, "habilidade_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_0fd260043dc9303cab2b54aee10" PRIMARY KEY ("projeto_id", "habilidade_id"))`);
        await queryRunner.query(`ALTER TABLE "projetos_habilidades" ADD CONSTRAINT "FK_7e8e8f5812a384aaba1c817b3f0" FOREIGN KEY ("projeto_id") REFERENCES "projetos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projetos_habilidades" ADD CONSTRAINT "FK_d2c8245ae1de7e201140b961618" FOREIGN KEY ("habilidade_id") REFERENCES "habilidades"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projetos_habilidades" DROP CONSTRAINT "FK_d2c8245ae1de7e201140b961618"`);
        await queryRunner.query(`ALTER TABLE "projetos_habilidades" DROP CONSTRAINT "FK_7e8e8f5812a384aaba1c817b3f0"`);
        await queryRunner.query(`DROP TABLE "projetos_habilidades"`);
    }

}
