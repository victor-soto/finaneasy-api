import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UserEntity } from '@/infrastructure/persistence/entities/user.entity';
import { TransactionEntity } from '@/infrastructure/persistence/entities/transaction.entity';
import { TransactionModule } from '@/infrastructure/modules/transaction/transaction.module';
import { UserModule } from '@/infrastructure/modules/user/user.module';
import { ApplicationModule } from '@/application/application.module';
import { ConfigModule } from '@/infrastructure/config/config.module';
import { SecretService } from '@/infrastructure/config/secret.service';
import { SECRET_SERVICE_TOKEN } from '@/domain/services/secret.service.interface';

/**
 * Root Application Module
 *
 * Orchestrates all layers of the application:
 * - Infrastructure modules (UserModule, TransactionModule)
 * - Application module (ApplicationModule)
 * - External services (TypeORM, GraphQL)
 *
 * This module serves as the composition root for the entire application.
 */
@Module({
  imports: [
    ConfigModule, // Import configuration module first
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'finaneasy',
      entities: [UserEntity, TransactionEntity],
      synchronize: false,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      introspection: true,
    }),
    ApplicationModule, // Import application layer first
    TransactionModule, // Infrastructure modules depend on application
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
