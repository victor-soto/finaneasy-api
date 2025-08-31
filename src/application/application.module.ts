import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { TransactionService } from './services/transaction.service';
import { USER_SERVICE_TOKEN } from '@/domain/services/user.service.interface';
import { TRANSACTION_SERVICE_TOKEN } from '@/domain/services/transaction.service.interface';
import {
  USER_REPOSITORY_TOKEN,
  IUserRepository,
} from '@/domain/repositories/user.repository.interface';
import {
  TRANSACTION_REPOSITORY_TOKEN,
  ITransactionRepository,
} from '@/domain/repositories/transaction.repository.interface';
import { UserEntity } from '@/infrastructure/persistence/entities/user.entity';
import { TransactionEntity } from '@/infrastructure/persistence/entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@/infrastructure/persistence/repositories/user.repository';
import { TransactionRepository } from '@/infrastructure/persistence/repositories/transaction.repository';

/**
 * Application Module
 *
 * Centralizes all application layer services and their dependencies.
 * This module provides application services to infrastructure modules
 * without creating direct dependencies between infrastructure and application layers.
 *
 * Responsibilities:
 * - Orchestrates domain and infrastructure layers
 * - Provides use case implementations
 * - Manages business logic coordination
 * - Exports application services for infrastructure consumption
 */
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TransactionEntity])],
  providers: [
    UserRepository,
    TransactionRepository,
    {
      provide: USER_REPOSITORY_TOKEN,
      useExisting: UserRepository,
    },
    {
      provide: TRANSACTION_REPOSITORY_TOKEN,
      useExisting: TransactionRepository,
    },
    {
      provide: USER_SERVICE_TOKEN,
      useFactory: (userRepository: IUserRepository) =>
        new UserService(userRepository),
      inject: [USER_REPOSITORY_TOKEN],
    },
    {
      provide: TRANSACTION_SERVICE_TOKEN,
      useFactory: (transactionRepository: ITransactionRepository) =>
        new TransactionService(transactionRepository),
      inject: [TRANSACTION_REPOSITORY_TOKEN],
    },
  ],
  exports: [USER_SERVICE_TOKEN, TRANSACTION_SERVICE_TOKEN],
})
export class ApplicationModule {}
