import { User } from '@/domain/entities/user.entity';
import { CreateUserDto } from '@/domain/dtos/create-user.dto';

export const USER_REPOSITORY_TOKEN = Symbol('IUserRepository');

/**
 * Repository interface for User domain entity
 * Defines the contract for user data access operations
 */
export interface IUserRepository {
  /**
   * Find a user by its unique identifier
   */
  findById(id: string): Promise<User | null>;

  /**
   * Find a user by email address
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Create a new user
   */
  create(createUserDto: CreateUserDto): Promise<User>;

  /**
   * Update an existing user
   */
  update(user: User): Promise<User>;

  /**
   * Delete a user by its unique identifier
   */
  delete(id: string): Promise<void>;

  /**
   * Check if a user exists by email address
   */
  existsByEmail(email: string): Promise<boolean>;

  /**
   * Find all users with optional pagination
   */
  findAll(limit?: number, offset?: number): Promise<User[]>;
}
