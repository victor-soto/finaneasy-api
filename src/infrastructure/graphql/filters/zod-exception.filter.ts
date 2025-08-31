import { ExceptionFilter, Catch } from '@nestjs/common';
import { z } from 'zod';

/**
 * Global exception filter for handling Zod validation errors
 * Converts Zod errors to proper GraphQL error responses
 */
@Catch(z.ZodError)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: z.ZodError) {
    // Convert Zod errors to GraphQL error format
    const errors = exception.issues.map((issue) => ({
      message: issue.message,
      path: issue.path.join('.'),
      code: 'VALIDATION_ERROR',
    }));

    // Return GraphQL error response
    return {
      errors,
    };
  }
}
