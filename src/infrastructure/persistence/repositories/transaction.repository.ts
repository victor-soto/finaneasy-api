import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITransactionRepository } from '@/domain/repositories/transaction.repository.interface';
import { Transaction } from '@/domain/entities/transaction.entity';
import { TransactionType } from '@/domain/entities/interfaces/domain.entities.interface';
import { CreateTransactionDto } from '@/domain/dtos/create-transaction.dto';
import { TransactionEntity } from '../entities/transaction.entity';
import { UserEntity } from '../entities/user.entity';

/**
 * TypeORM implementation of Transaction repository
 * Implements the domain repository interface
 */
@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepo: Repository<TransactionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findById(id: string): Promise<Transaction | null> {
    const entity: TransactionEntity = await this.transactionRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    return entity ? entity.toDomain() : null;
  }

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const userEntity = await this.userRepo.findOne({
      where: { id: createTransactionDto.userId },
    });

    if (!userEntity) {
      throw new Error('User not found');
    }

    const entity = TransactionEntity.fromCreateData(
      createTransactionDto.amount,
      createTransactionDto.description,
      createTransactionDto.transactionType,
      createTransactionDto.category,
      userEntity,
    );
    const savedEntity = await this.transactionRepo.save(entity);
    return savedEntity.toDomain();
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const entity = TransactionEntity.fromDomain(transaction);
    const updatedEntity = await this.transactionRepo.save(entity);
    return updatedEntity.toDomain();
  }

  async delete(id: string): Promise<void> {
    await this.transactionRepo.delete(id);
  }

  async findByUserId(
    userId: string,
    limit?: number,
    offset?: number,
  ): Promise<Transaction[]> {
    const entities = await this.transactionRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => entity.toDomain());
  }

  async findByUserIdAndType(
    userId: string,
    transactionType: TransactionType,
    limit?: number,
    offset?: number,
  ): Promise<Transaction[]> {
    const entities = await this.transactionRepo.find({
      where: { user: { id: userId }, transactionType },
      relations: ['user'],
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => entity.toDomain());
  }

  async getTransactionStats(userId: string): Promise<{
    totalIncome: number;
    totalExpense: number;
    balance: number;
    transactionCount: number;
  }> {
    const [incomeResult, expenseResult, countResult] = await Promise.all([
      this.transactionRepo
        .createQueryBuilder('transaction')
        .select('SUM(transaction.amount)', 'total')
        .where('transaction.user.id = :userId', { userId })
        .andWhere('transaction.transactionType = :type', { type: 'INCOME' })
        .getRawOne(),
      this.transactionRepo
        .createQueryBuilder('transaction')
        .select('SUM(transaction.amount)', 'total')
        .where('transaction.user.id = :userId', { userId })
        .andWhere('transaction.transactionType = :type', { type: 'EXPENSE' })
        .getRawOne(),
      this.transactionRepo.count({ where: { user: { id: userId } } }),
    ]);

    const totalIncome = parseFloat(String(incomeResult?.total || '0'));
    const totalExpense = parseFloat(String(expenseResult?.total || '0'));
    const balance = totalIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      balance,
      transactionCount: countResult,
    };
  }
}
