import { Injectable } from '@nestjs/common';
import { ISecretService } from '@/domain/services/secret.service.interface';
import { ConfigService } from '@nestjs/config';

/**
 * Infrastructure implementation of SecretService
 * Extends NestJS ConfigService to provide configuration access
 * Implements the domain interface for configuration management
 */
@Injectable()
export class SecretService implements ISecretService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Get a configuration value by key with optional default
   */
  get<T = string>(key: string, defaultValue?: T): T {
    return this.configService.get<T>(key, defaultValue);
  }

  /**
   * Get a required configuration value by key
   * @throws Error if key doesn't exist
   */
  getRequired<T = string>(key: string): T {
    const value = this.get<T>(key);
    if (value === undefined) {
      throw new Error(`Configuration key "${key}" is required but not found`);
    }
    return value;
  }

  /**
   * Get a configuration value as number
   */
  getNumber(key: string, defaultValue?: number): number {
    const value = this.get<string>(key);
    if (value === undefined) {
      return defaultValue ?? 0;
    }
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? (defaultValue ?? 0) : parsed;
  }

  /**
   * Get a configuration value as boolean
   */
  getBoolean(key: string, defaultValue?: boolean): boolean {
    const value = this.get<string>(key);
    if (value === undefined) {
      return defaultValue ?? false;
    }
    return value.toLowerCase() === 'true';
  }

  /**
   * Get a configuration value as array (comma-separated string)
   */
  getArray(key: string, defaultValue?: string[]): string[] {
    const value = this.get<string>(key);
    if (value === undefined) {
      return defaultValue ?? [];
    }
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  /**
   * Check if a configuration key exists
   */
  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Get all configuration keys
   * Note: This is a simplified implementation
   */
  getKeys(): string[] {
    // This is a simplified implementation
    // In a real scenario, you might want to return actual keys
    return Object.keys(process.env);
  }

  /**
   * Get database configuration object
   */
  getDatabaseConfig(): {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  } {
    return {
      host: this.get('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.get('DB_USERNAME'),
      password: this.get('DB_PASSWORD'),
      database: this.get('DB_DATABASE'),
    };
  }

  /**
   * Get CORS configuration object
   */
  getCorsConfig(): {
    origins: string[];
    credentials: boolean;
    methods: string[];
    allowedHeaders: string[];
    maxAge: number;
  } {
    return {
      origins: this.getArray('ALLOWED_ORIGINS'),
      credentials: this.getBoolean('CORS_CREDENTIALS'),
      methods: this.getArray('CORS_METHODS'),
      allowedHeaders: this.getArray('CORS_ALLOWED_HEADERS'),
      maxAge: this.getNumber('CORS_MAX_AGE'),
    };
  }
}
