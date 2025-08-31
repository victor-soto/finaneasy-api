import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction } from '@/domain/entities/transaction.entity';
import { TransactionType } from '@/domain/entities/interfaces/domain.entities.interface';
import { UserEntity } from './user.entity';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  description: string;

  @Column({
    name: 'transaction_type',
    type: 'enum',
    enum: TransactionType,
  })
  transactionType: TransactionType;

  @Column({ name: 'category', nullable: true })
  category?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  /**
   * Converts the TypeORM entity to a domain entity
   */
  toDomain(): Transaction {
    return new Transaction(
      this.id,
      this.amount,
      this.description,
      this.transactionType,
      this.category,
      this.createdAt,
      this.updatedAt,
      this.user?.toDomain(),
    );
  }

  /**
   * Creates a TypeORM entity from a domain entity
   */
  static fromDomain(transaction: Transaction): TransactionEntity {
    const entity = new TransactionEntity();
    entity.id = transaction.id;
    entity.amount = transaction.amount;
    entity.description = transaction.description;
    entity.transactionType = transaction.transactionType;
    entity.category = transaction.category;
    entity.createdAt = transaction.createdAt;
    entity.updatedAt = transaction.updatedAt;
    if (transaction.user) {
      entity.user = UserEntity.fromDomain(transaction.user);
    }
    return entity;
  }

  /**
   * Creates a TypeORM entity from transaction creation data
   */
  static fromCreateData(
    amount: number,
    description: string,
    transactionType: TransactionType,
    category: string | undefined,
    user: UserEntity,
  ): TransactionEntity {
    const entity = new TransactionEntity();
    entity.amount = amount;
    entity.description = description;
    entity.transactionType = transactionType;
    entity.category = category;
    entity.user = user;
    return entity;
  }
}
