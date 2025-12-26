import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class CreateRedefinirSenha1766770639377 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('usuarios');
    const column = table?.findColumnByName('token_recuperacao_senha');

    if (!column) {
      await queryRunner.addColumn(
        'usuarios',
        new TableColumn({
          name: 'token_recuperacao_senha',
          type: 'varchar',
          length: '255',
          isNullable: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('usuarios', 'token_recuperacao_senha');
  }
}
