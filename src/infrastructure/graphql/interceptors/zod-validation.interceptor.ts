import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { z } from 'zod';
import { ZOD_VALIDATION_SCHEMA } from '../decorators/validate-input.decorator';

/**
 * Interceptor for Zod validation in GraphQL resolvers
 * Reads validation schema from metadata and validates input data
 */
@Injectable()
export class ZodValidationInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Get the validation schema from metadata
    const schema = this.reflector.get<z.ZodSchema>(
      ZOD_VALIDATION_SCHEMA,
      context.getHandler(),
    );

    if (schema) {
      // Get GraphQL context and input data
      const gqlCtx = context.getArgByIndex(2);
      const input = gqlCtx?.input;

      if (input) {
        try {
          // Validate input against schema
          schema.parse(input);
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

    return next.handle();
  }
}
