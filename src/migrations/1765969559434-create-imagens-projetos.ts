import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateImagensProjetos1765969559434 implements MigrationInterface {
  name = 'CreateImagensProjetos1765969559434';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "imagens_projetos" ("id" SERIAL NOT NULL, "projeto_id" integer NOT NULL, "imagem_url" character varying(255) NOT NULL, "uploaded_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_aacf80b73bf921e87800e081700" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "imagens_projetos" ADD CONSTRAINT "FK_0aa7c7bfd965471ef4f29913096" FOREIGN KEY ("projeto_id") REFERENCES "projetos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "imagens_projetos" DROP CONSTRAINT "FK_0aa7c7bfd965471ef4f29913096"`,
    );
    await queryRunner.query(`DROP TABLE "imagens_projetos"`);
  }
}
