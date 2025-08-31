import { InputType, Field } from '@nestjs/graphql';
import { z } from 'zod';
import { CreateUserDto } from '@/domain/dtos/create-user.dto';

/**
 * Zod schema for user creation validation
 */
export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type CreateUserInputType = z.infer<typeof CreateUserSchema>;

/**
 * GraphQL input adapter for creating a user
 * Maps GraphQL input to domain DTO with Zod validation
 */
@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  password: string;

  /**
   * Validates input using Zod and converts to domain DTO
   * @throws BadRequestException if validation fails
   */
  toDomainDto(): CreateUserDto {
    // Validate input using Zod
    const validatedData = CreateUserSchema.parse({
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
    });

    return new CreateUserDto(
      validatedData.email,
      validatedData.firstName,
      validatedData.lastName,
      validatedData.password,
    );
  }

  /**
   * Validates input and returns validation result
   */
  validate(): { success: boolean; errors?: string[] } {
    const result = CreateUserSchema.safeParse({
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
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
