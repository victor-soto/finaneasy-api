import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { z } from 'zod';

/**
 * Zod validation pipe for GraphQL input validation
 * Follows NestJS pipe patterns for consistent validation
 */
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: z.ZodSchema) {}

  transform(value: unknown): z.infer<typeof this.schema> {
    if (!value) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: [{ field: 'input', message: 'Input data is required' }],
      });
    }

    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      throw error;
    }
  }
}

/**
 * Factory function to create a Zod validation pipe
 * @param schema - The Zod schema to validate against
 * @returns A ZodValidationPipe instance with proper typing
 */
export function createZodValidationPipe<T extends z.ZodSchema>(
  schema: T,
): ZodValidationPipe & {
  transform(value: unknown): z.infer<T>;
} {
  return new ZodValidationPipe(schema) as ZodValidationPipe & {
    transform(value: unknown): z.infer<T>;
  };
}
