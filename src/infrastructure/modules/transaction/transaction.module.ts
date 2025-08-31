import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '@/infrastructure/persistence/entities/transaction.entity';
import { UserEntity } from '@/infrastructure/persistence/entities/user.entity';
import { TransactionRepository } from '@/infrastructure/persistence/repositories/transaction.repository';
import { TransactionResolver } from '@/infrastructure/graphql/resolvers/transaction.resolver';
import { ZodValidationService } from '@/infrastructure/validation/zod-validation.service';
import { TRANSACTION_REPOSITORY_TOKEN } from '@/domain/repositories/transaction.repository.interface';
import { ApplicationModule } from '@/application/application.module';
import { Repository } from 'typeorm';

/**
 * Transaction Infrastructure Module
 *
 * Provides infrastructure adapters for Transaction domain operations.
 * Imports ApplicationModule to get access to application services
 * without creating direct dependencies on application layer.
 *
 * Responsibilities:
 * - Database persistence (TransactionRepository)
 * - GraphQL API (TransactionResolver)
 * - Input validation (ZodValidationService)
 * - Module configuration and dependency injection
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity, UserEntity]),
    ApplicationModule, // Import application services
  ],
  providers: [
    {
      provide: TRANSACTION_REPOSITORY_TOKEN,
      useFactory(
        transactionRepo: Repository<TransactionEntity>,
        userRepo: Repository<UserEntity>,
      ) {
        return new TransactionRepository(transactionRepo, userRepo);
      },
    },
    TransactionResolver,
    ZodValidationService,
  ],
  exports: [TRANSACTION_REPOSITORY_TOKEN],
})
export class TransactionModule {}
