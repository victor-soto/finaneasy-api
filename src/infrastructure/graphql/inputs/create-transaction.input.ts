import { InputType, Field } from '@nestjs/graphql';
import { z } from 'zod';
import { CreateTransactionDto } from '@/domain/dtos/create-transaction.dto';
import { TransactionType } from '@/domain/entities/interfaces/domain.entities.interface';

/**
 * Zod schema for transaction creation validation
 */
export const CreateTransactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required'),
  transactionType: z.nativeEnum(TransactionType),
  category: z.string().optional(),
  userId: z.string().uuid('User ID must be a valid UUID'),
});

export type CreateTransactionInputType = z.infer<
  typeof CreateTransactionSchema
>;

/**
 * GraphQL input adapter for creating a transaction
 * Maps GraphQL input to domain DTO with Zod validation
 */
@InputType()
export class CreateTransactionInput {
  @Field()
  amount: number;

  @Field()
  description: string;

  @Field(() => TransactionType)
  transactionType: TransactionType;

  @Field({ nullable: true })
  category?: string;

  @Field()
  userId: string;

  /**
   * Validates input using Zod and converts to domain DTO
   * @throws BadRequestException if validation fails
   */
  toDomainDto(): CreateTransactionDto {
    // Validate input using Zod
    const validatedData = CreateTransactionSchema.parse({
      amount: this.amount,
      description: this.description,
      transactionType: this.transactionType,
      category: this.category,
      userId: this.userId,
    });

    return new CreateTransactionDto(
      validatedData.amount,
      validatedData.description,
      validatedData.transactionType,
      validatedData.category,
      validatedData.userId,
    );
  }

  /**
   * Validates input and returns validation result
   */
  validate(): { success: boolean; errors?: string[] } {
    const result = CreateTransactionSchema.safeParse({
      amount: this.amount,
      description: this.description,
      transactionType: this.transactionType,
      category: this.category,
      userId: this.userId,
    });

    if (result.success) {
      return { success: true };
    }

    return {
      success: false,
      errors: result.error.issues.map((issue) => issue.message),
    };
  }
}
