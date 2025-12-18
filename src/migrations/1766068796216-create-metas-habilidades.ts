import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMetasHabilidades1766068796216 implements MigrationInterface {
    name = 'CreateMetasHabilidades1766068796216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "metas_habilidades" ("meta_id" integer NOT NULL, "habilidade_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_2a45599cbe942c54c4e0653cc30" PRIMARY KEY ("meta_id", "habilidade_id"))`);
        await queryRunner.query(`ALTER TABLE "metas_habilidades" ADD CONSTRAINT "FK_1c63d0bb948ddad0ecc480b9656" FOREIGN KEY ("meta_id") REFERENCES "metas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "metas_habilidades" ADD CONSTRAINT "FK_68500b4980a493f242bbc2027ca" FOREIGN KEY ("habilidade_id") REFERENCES "habilidades"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "metas_habilidades" DROP CONSTRAINT "FK_68500b4980a493f242bbc2027ca"`);
        await queryRunner.query(`ALTER TABLE "metas_habilidades" DROP CONSTRAINT "FK_1c63d0bb948ddad0ecc480b9656"`);
        await queryRunner.query(`DROP TABLE "metas_habilidades"`);
    }

}
