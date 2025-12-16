import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsuarios1765801791932 implements MigrationInterface {
  name = 'CreateUsuarios1765801791932';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."usuarios_nivel_formacao_enum" AS ENUM('fundamental', 'medio', 'tecnico', 'graduacao', 'pos_graduacao', 'mestrado', 'doutorado')`,
    );
    await queryRunner.query(
      `CREATE TABLE "usuarios" ("id" SERIAL NOT NULL, "nome" character varying(100) NOT NULL, "sobrenome" character varying(100) NOT NULL, "email" character varying(150) NOT NULL, "telefone" character varying(20), "dataNascimento" date, "avatar_url" character varying(255), "bio" character varying(255), "senha" character varying(255) NOT NULL, "localizacao" character varying(100), "nivel_formacao" "public"."usuarios_nivel_formacao_enum" NOT NULL DEFAULT 'graduacao', "instituicao" character varying(255), "objetivo_profissional" character varying(255), "area_interesse" character varying(255), "linkedin" character varying(255), "github" character varying(255), "site" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "usuarios"`);
    await queryRunner.query(
      `DROP TYPE "public"."usuarios_nivel_formacao_enum"`,
    );
  }
}
