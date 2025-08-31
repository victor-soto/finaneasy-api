import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { SecretService } from './secret.service';
import { SECRET_SERVICE_TOKEN } from '@/domain/services/secret.service.interface';

/**
 * Configuration Module
 *
 * Provides configuration services and environment variable management.
 * This module is part of the infrastructure layer and provides
 * configuration access to the application layer.
 *
 * Responsibilities:
 * - Load environment variables
 * - Provide SecretService for configuration access
 * - Validate required configuration values
 * - Centralize configuration management
 */
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true, // Make config available globally
      envFilePath: ['.env.local', '.env'], // Load .env.local first, then .env
      cache: true, // Cache configuration values for performance
      expandVariables: true, // Support variable expansion in .env files
    }),
  ],
  providers: [
    SecretService,
    {
      provide: SECRET_SERVICE_TOKEN,
      useExisting: SecretService,
    },
  ],
  exports: [SECRET_SERVICE_TOKEN],
})
export class ConfigModule {}
