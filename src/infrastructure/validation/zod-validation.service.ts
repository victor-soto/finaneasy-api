import { Injectable, BadRequestException } from '@nestjs/common';
import { z } from 'zod';

/**
 * Service for handling Zod validation across the application
 * Provides centralized validation with proper error handling
 */
@Injectable()
export class ZodValidationService {
  /**
   * Validates data against a Zod schema and returns the validated data
   * @param schema - The Zod schema to validate against
   * @param data - The data to validate
   * @returns The validated data
   * @throws BadRequestException if validation fails
   */
  validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
          })),
        });
      }
      throw error;
    }
  }

  /**
   * Validates data against a Zod schema and returns the validated data or null
   * @param schema - The Zod schema to validate against
   * @param data - The data to validate
   * @returns The validated data or null if validation fails
   */
  validateSafe<T>(schema: z.ZodSchema<T>, data: unknown): T | null {
    try {
      return schema.parse(data);
    } catch {
      return null;
    }
  }

  /**
   * Validates data against a Zod schema and returns validation result
   * @param schema - The Zod schema to validate against
   * @param data - The data to validate
   * @returns Object containing success status and data/errors
   */
  validateResult<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
  ): {
    success: boolean;
    data?: T;
    errors?: Array<{ field: string; message: string; code: string }>;
  } {
    try {
      const validatedData = schema.parse(data);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
          })),
        };
      }
      throw error;
    }
  }
}
