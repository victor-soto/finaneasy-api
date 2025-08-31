import { Injectable, Inject } from '@nestjs/common';
import { ITransactionService } from '@/domain/services/transaction.service.interface';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY_TOKEN,
} from '@/domain/repositories/transaction.repository.interface';
import { Transaction } from '@/domain/entities/transaction.entity';
import { TransactionType } from '@/domain/entities/interfaces/domain.entities.interface';
import { CreateTransactionDto } from '@/domain/dtos/create-transaction.dto';

/**
 * Application service implementation for Transaction domain operations
 * Implements the domain service interface
 */
@Injectable()
export class TransactionService implements ITransactionService {
  constructor(
    @Inject(TRANSACTION_REPOSITORY_TOKEN)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async findById(id: string): Promise<Transaction | null> {
    return this.transactionRepository.findById(id);
  }

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    // Domain validation
    if (!createTransactionDto.isValid()) {
      const errors = createTransactionDto.getValidationErrors();
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    return this.transactionRepository.create(createTransactionDto);
  }

  async updateTransaction(
    id: string,
    updates: Partial<Transaction>,
  ): Promise<Transaction> {
    const existingTransaction = await this.transactionRepository.findById(id);
    if (!existingTransaction) {
      throw new Error('Transaction not found');
    }

    // Create updated transaction instance
    const updatedTransaction = new Transaction(
      existingTransaction.id,
      updates.amount ?? existingTransaction.amount,
      updates.description ?? existingTransaction.description,
      updates.transactionType ?? existingTransaction.transactionType,
      updates.category ?? existingTransaction.category,
      existingTransaction.createdAt,
      new Date(),
      existingTransaction.user,
    );

    return this.transactionRepository.update(updatedTransaction);
  }

  async deleteTransaction(id: string): Promise<void> {
    const existingTransaction = await this.transactionRepository.findById(id);
    if (!existingTransaction) {
      throw new Error('Transaction not found');
    }

    await this.transactionRepository.delete(id);
  }

  async getTransactionsByUserId(
    userId: string,
    limit?: number,
    offset?: number,
  ): Promise<Transaction[]> {
    return this.transactionRepository.findByUserId(userId, limit, offset);
  }

  async getTransactionsByUserIdAndType(
    userId: string,
    transactionType: TransactionType,
    limit?: number,
    offset?: number,
  ): Promise<Transaction[]> {
    return this.transactionRepository.findByUserIdAndType(
      userId,
      transactionType,
      limit,
      offset,
    );
  }

  async getTransactionStats(userId: string): Promise<{
    totalIncome: number;
    totalExpense: number;
    balance: number;
    transactionCount: number;
  }> {
    return this.transactionRepository.getTransactionStats(userId);
  }
}
