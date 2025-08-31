import { Transaction } from '@/domain/entities/transaction.entity';
import { TransactionType } from '@/domain/entities/interfaces/domain.entities.interface';
import { CreateTransactionDto } from '@/domain/dtos/create-transaction.dto';

/**
 * Injection token for Transaction Repository
 */
export const TRANSACTION_REPOSITORY_TOKEN = Symbol('ITransactionRepository');

/**
 * Repository interface for Transaction domain entity
 * Defines the contract for transaction data access operations
 */
export interface ITransactionRepository {
  /**
   * Find a transaction by its unique identifier
   */
  findById(id: string): Promise<Transaction | null>;

  /**
   * Create a new transaction
   */
  create(createTransactionDto: CreateTransactionDto): Promise<Transaction>;

  /**
   * Update an existing transaction
   */
  update(transaction: Transaction): Promise<Transaction>;

  /**
   * Delete a transaction by its unique identifier
   */
  delete(id: string): Promise<void>;

  /**
   * Find all transactions for a specific user
   */
  findByUserId(
    userId: string,
    limit?: number,
    offset?: number,
  ): Promise<Transaction[]>;

  /**
   * Find transactions by type for a specific user
   */
  findByUserIdAndType(
    userId: string,
    transactionType: TransactionType,
    limit?: number,
    offset?: number,
  ): Promise<Transaction[]>;

  /**
   * Get transaction statistics for a user
   */
  getTransactionStats(userId: string): Promise<{
    totalIncome: number;
    totalExpense: number;
    balance: number;
    transactionCount: number;
  }>;
}
