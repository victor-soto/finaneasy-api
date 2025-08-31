import { TransactionType } from '@/domain/entities/interfaces/domain.entities.interface';

/**
 * Domain DTO for creating a transaction
 * Contains validation rules and business constraints
 */
export class CreateTransactionDto {
  constructor(
    public readonly amount: number,
    public readonly description: string,
    public readonly transactionType: TransactionType,
    public readonly category: string | undefined,
    public readonly userId: string,
  ) {}

  /**
   * Domain validation: Check if all required fields are present
   */
  isValid(): boolean {
    return (
      this.hasValidAmount() &&
      this.hasValidDescription() &&
      this.hasValidTransactionType() &&
      this.hasValidUserId()
    );
  }

  /**
   * Domain validation: Check if amount is valid
   */
  hasValidAmount(): boolean {
    return this.amount > 0;
  }

  /**
   * Domain validation: Check if description is valid
   */
  hasValidDescription(): boolean {
    return this.description.trim().length > 0;
  }

  /**
   * Domain validation: Check if transaction type is valid
   */
  hasValidTransactionType(): boolean {
    return (
      this.transactionType === TransactionType.INCOME ||
      this.transactionType === TransactionType.EXPENSE
    );
  }

  /**
   * Domain validation: Check if user ID is valid
   */
  hasValidUserId(): boolean {
    return this.userId.trim().length > 0;
  }

  /**
   * Domain validation: Get all validation errors
   */
  getValidationErrors(): string[] {
    const errors: string[] = [];

    if (!this.hasValidAmount()) {
      errors.push('Amount must be greater than 0');
    }

    if (!this.hasValidDescription()) {
      errors.push('Description is required');
    }

    if (!this.hasValidTransactionType()) {
      errors.push('Transaction type must be INCOME or EXPENSE');
    }

    if (!this.hasValidUserId()) {
      errors.push('User ID is required');
    }

    return errors;
  }
}
