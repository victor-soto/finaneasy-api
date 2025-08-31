import {
  ITransaction,
  IUser,
  TransactionType,
} from './interfaces/domain.entities.interface';

/**
 * Domain entity for Transaction
 * Contains business logic and is free from infrastructure concerns
 */
export class Transaction implements ITransaction {
  constructor(
    public readonly id: string,
    public readonly amount: number,
    public readonly description: string,
    public readonly transactionType: TransactionType,
    public readonly category: string | undefined,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly user?: IUser,
  ) {}

  /**
   * Business logic: Check if transaction is income
   */
  isIncome(): boolean {
    return this.transactionType === TransactionType.INCOME;
  }

  /**
   * Business logic: Check if transaction is expense
   */
  isExpense(): boolean {
    return this.transactionType === TransactionType.EXPENSE;
  }

  /**
   * Business logic: Get signed amount (positive for income, negative for expense)
   */
  getSignedAmount(): number {
    return this.isIncome() ? this.amount : -this.amount;
  }

  /**
   * Business logic: Check if transaction amount is valid
   */
  hasValidAmount(): boolean {
    return this.amount > 0;
  }

  /**
   * Business logic: Check if transaction has required fields
   */
  isValid(): boolean {
    return (
      this.hasValidAmount() &&
      this.description.trim().length > 0 &&
      (this.transactionType === TransactionType.INCOME ||
        this.transactionType === TransactionType.EXPENSE)
    );
  }

  /**
   * Business logic: Update transaction category
   */
  updateCategory(category: string): ITransaction {
    return new Transaction(
      this.id,
      this.amount,
      this.description,
      this.transactionType,
      category,
      this.createdAt,
      new Date(),
      this.user,
    );
  }
}
