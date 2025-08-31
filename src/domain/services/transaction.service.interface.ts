import { Transaction } from '@/domain/entities/transaction.entity';
import { TransactionType } from '@/domain/entities/interfaces/domain.entities.interface';
import { CreateTransactionDto } from '@/domain/dtos/create-transaction.dto';

/**
 * Injection token for Transaction Service
 */
export const TRANSACTION_SERVICE_TOKEN = Symbol('ITransactionService');

/**
 * Service interface for Transaction domain operations
 * Defines the contract for transaction business logic
 */
export interface ITransactionService {
  /**
   * Find a transaction by its unique identifier
   */
  findById(id: string): Promise<Transaction | null>;

  /**
   * Create a new transaction with validation
   */
  createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction>;

  /**
   * Update an existing transaction
   */
  updateTransaction(
    id: string,
    updates: Partial<Transaction>,
  ): Promise<Transaction>;

  /**
   * Delete a transaction by its unique identifier
   */
  deleteTransaction(id: string): Promise<void>;

  /**
   * Get all transactions for a specific user
   */
  getTransactionsByUserId(
    userId: string,
    limit?: number,
    offset?: number,
  ): Promise<Transaction[]>;

  /**
   * Get transactions by type for a specific user
   */
  getTransactionsByUserIdAndType(
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
