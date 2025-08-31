/**
 * Domain entity interfaces - defines contracts for domain entities
 * Used to break circular dependencies between domain entities
 */

/**
 * Transaction type enum - part of domain business rules
 */
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

/**
 * User interface - defines the contract for User entity
 */
export interface IUser {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly password: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly transactions: ITransaction[];

  getFullName(): string;
  updatePassword(newPassword: string): IUser;
}

/**
 * Transaction interface - defines the contract for Transaction entity
 */
export interface ITransaction {
  readonly id: string;
  readonly amount: number;
  readonly description: string;
  readonly transactionType: TransactionType;
  readonly category: string | undefined;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly user?: IUser;

  isIncome(): boolean;
  isExpense(): boolean;
  getSignedAmount(): number;
  hasValidAmount(): boolean;
  isValid(): boolean;
  updateCategory(category: string): ITransaction;
}
