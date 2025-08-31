import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config(); // Load environment variables

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'finaneasy',
  entities: ['src/domain/entities/*.entity.ts'],
  migrations: ['src/infrastructure/persistence/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false, // Disable synchronize for migrations
  logging: true,
});
