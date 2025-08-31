import { QueryRunner } from 'typeorm';

export abstract class BaseMigration {
  protected async createIndex(
    queryRunner: QueryRunner,
    tableName: string,
    columnName: string,
    indexName?: string,
  ): Promise<void> {
    const index = indexName || `IDX_${tableName}_${columnName}`;
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "${index}" ON "${tableName}" ("${columnName}")`,
    );
  }

  protected async dropIndex(
    queryRunner: QueryRunner,
    tableName: string,
    columnName: string,
    indexName?: string,
  ): Promise<void> {
    const index = indexName || `IDX_${tableName}_${columnName}`;
    await queryRunner.query(`DROP INDEX IF EXISTS "${index}"`);
  }

  protected async addForeignKey(
    queryRunner: QueryRunner,
    params: {
      tableName: string;
      columnName: string;
      referencedTable: string;
      referencedColumn: string;
      constraintName?: string;
      onDelete?: 'CASCADE' | 'SET NULL' | 'NO ACTION';
    },
  ): Promise<void> {
    const {
      tableName,
      columnName,
      referencedTable,
      referencedColumn,
      constraintName,
      onDelete = 'NO ACTION',
    } = params;

    const constraint = constraintName || `FK_${tableName}_${columnName}`;
    await queryRunner.query(`
      ALTER TABLE "${tableName}" 
      ADD CONSTRAINT "${constraint}" 
      FOREIGN KEY ("${columnName}") 
      REFERENCES "${referencedTable}"("${referencedColumn}") 
      ON DELETE ${onDelete} ON UPDATE NO ACTION
    `);
  }

  protected async dropForeignKey(
    queryRunner: QueryRunner,
    params: {
      tableName: string;
      columnName: string;
      constraintName?: string;
    },
  ): Promise<void> {
    const { tableName, columnName, constraintName } = params;
    const constraint = constraintName || `FK_${tableName}_${columnName}`;
    await queryRunner.query(
      `ALTER TABLE "${tableName}" DROP CONSTRAINT IF EXISTS "${constraint}"`,
    );
  }
}
