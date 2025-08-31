import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { z } from 'zod';
import { ZOD_VALIDATION_SCHEMA } from '../decorators/validate-input.decorator';

/**
 * Guard for Zod validation in GraphQL resolvers
 * Follows NestJS guard patterns for validation
 */
@Injectable()
export class ZodValidationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const schema = this.reflector.get<z.ZodSchema>(
      ZOD_VALIDATION_SCHEMA,
      context.getHandler(),
    );

    if (!schema) {
      return true; // No validation schema defined, allow the request
    }

    // Get GraphQL context and input data
    const gqlCtx = context.getArgByIndex(2);
    const input = gqlCtx?.input;

    if (!input) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: [{ field: 'input', message: 'Input data is required' }],
      });
    }

    try {
      schema.parse(input);
      return true;
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
