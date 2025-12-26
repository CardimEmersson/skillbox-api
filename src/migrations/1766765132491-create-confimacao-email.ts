import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConfimacaoEmail1766765132491 implements MigrationInterface {
  name = 'CreateConfimacaoEmail1766765132491';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usuarios" ADD "email_confirmado" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuarios" ADD "token_confirmacao" character varying(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usuarios" DROP COLUMN "token_confirmacao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuarios" DROP COLUMN "email_confirmado"`,
    );
  }
}
