export const SECRET_SERVICE_TOKEN = Symbol('ISecretService');

/**
 * Service interface for accessing configuration and secrets
 * Defines the contract for configuration access without depending on specific implementations
 */
export interface ISecretService {
  /**
   * Get a configuration value by key
   * @param key - Configuration key
   * @param defaultValue - Optional default value if key doesn't exist
   * @returns Configuration value or default
   */
  get<T = string>(key: string, defaultValue?: T): T;

  /**
   * Get a required configuration value by key
   * @param key - Configuration key
   * @returns Configuration value
   * @throws Error if key doesn't exist
   */
  getRequired<T = string>(key: string): T;

  /**
   * Get a configuration value as number
   * @param key - Configuration key
   * @param defaultValue - Optional default value
   * @returns Number value or default
   */
  getNumber(key: string, defaultValue?: number): number;

  /**
   * Get a configuration value as boolean
   * @param key - Configuration key
   * @param defaultValue - Optional default value
   * @returns Boolean value or default
   */
  getBoolean(key: string, defaultValue?: boolean): boolean;

  /**
   * Get a configuration value as array (comma-separated string)
   * @param key - Configuration key
   * @param defaultValue - Optional default value
   * @returns Array of strings or default
   */
  getArray(key: string, defaultValue?: string[]): string[];

  /**
   * Check if a configuration key exists
   * @param key - Configuration key
   * @returns True if key exists
   */
  has(key: string): boolean;

  /**
   * Get all configuration keys
   * @returns Array of all configuration keys
   */
  getKeys(): string[];

  /**
   * Get database configuration object
   * @returns Database configuration
   */
  getDatabaseConfig(): {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };

  /**
   * Get CORS configuration object
   * @returns CORS configuration
   */
  getCorsConfig(): {
    origins: string[];
    credentials: boolean;
    methods: string[];
    allowedHeaders: string[];
    maxAge: number;
  };
}
