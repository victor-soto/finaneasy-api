import { MigrationInterface, QueryRunner } from 'typeorm';
import { BaseMigration } from '../utils/migration.factory';

export class InitialSchema1704067200000
  extends BaseMigration
  implements MigrationInterface
{
  name = 'InitialSchema1704067200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create transaction type enum
    await queryRunner.query(`
      CREATE TYPE "public"."transaction_type_enum" AS ENUM('INCOME', 'EXPENSE')
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying(255) NOT NULL,
        "first_name" character varying(100) NOT NULL,
        "last_name" character varying(100) NOT NULL,
        "password" character varying(255) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "users_email_unique" UNIQUE ("email"),
        PRIMARY KEY ("id")
      )
    `);

    // Create transactions table
    await queryRunner.query(`
      CREATE TABLE "transactions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "amount" decimal(10,2) NOT NULL,
        "description" character varying(500) NOT NULL,
        "transaction_type" "public"."transaction_type_enum" NOT NULL,
        "category" character varying(100),
        "user_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        PRIMARY KEY ("id")
      )
    `);

    // Add foreign key constraint using factory method
    await this.addForeignKey(queryRunner, {
      tableName: 'transactions',
      columnName: 'user_id',
      referencedTable: 'users',
      referencedColumn: 'id',
      onDelete: 'CASCADE',
    });

    // Create indexes using factory methods
    await this.createIndex(queryRunner, 'transactions', 'user_id');
    await this.createIndex(queryRunner, 'transactions', 'created_at');
    await this.createIndex(queryRunner, 'transactions', 'transaction_type');
    await this.createIndex(queryRunner, 'users', 'email');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes using factory methods
    await this.dropIndex(queryRunner, 'users', 'email');
    await this.dropIndex(queryRunner, 'transactions', 'transaction_type');
    await this.dropIndex(queryRunner, 'transactions', 'created_at');
    await this.dropIndex(queryRunner, 'transactions', 'user_id');

    // Drop foreign key constraint using factory method
    await this.dropForeignKey(queryRunner, {
      tableName: 'transactions',
      columnName: 'user_id',
    });

    // Drop tables
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TABLE "users"`);

    // Drop enum
    await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
  }
}
