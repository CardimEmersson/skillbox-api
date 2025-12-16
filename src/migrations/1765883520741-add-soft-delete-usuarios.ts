import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSoftDeleteUsuarios1765883520741 implements MigrationInterface {
  name = 'AddSoftDeleteUsuarios1765883520741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usuarios" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "categorias" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "categorias" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "categorias" ADD "deleted_at" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categorias" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "categorias" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "categorias" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "deleted_at"`);
  }
}
