import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategorias1765828847457 implements MigrationInterface {
  name = 'CreateCategorias1765828847457';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "categorias" ("id" SERIAL NOT NULL, "nome" character varying(100) NOT NULL, CONSTRAINT "PK_3886a26251605c571c6b4f861fe" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "categorias"`);
  }
}
