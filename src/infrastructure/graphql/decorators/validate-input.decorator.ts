import { SetMetadata } from '@nestjs/common';
import { z } from 'zod';

/**
 * Metadata key for Zod validation schemas
 */
export const ZOD_VALIDATION_SCHEMA = 'zod_validation_schema';

/**
 * Decorator to mark a resolver method for Zod validation
 * @param schema - The Zod schema to validate against
 * @returns A decorator that sets metadata for validation
 */
export const ValidateInput = <T extends z.ZodSchema>(schema: T) =>
  SetMetadata(ZOD_VALIDATION_SCHEMA, schema);
