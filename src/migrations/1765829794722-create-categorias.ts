import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategorias1765829794722 implements MigrationInterface {
  name = 'CreateCategorias1765829794722';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categorias" ADD "usuario_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "categorias" ADD CONSTRAINT "FK_7da46858c3ebb047fa03b09bb9b" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categorias" DROP CONSTRAINT "FK_7da46858c3ebb047fa03b09bb9b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "categorias" DROP COLUMN "usuario_id"`,
    );
  }
}
