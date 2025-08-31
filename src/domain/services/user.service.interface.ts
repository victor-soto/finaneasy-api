import { User } from '@/domain/entities/user.entity';
import { CreateUserDto } from '@/domain/dtos/create-user.dto';

export const USER_SERVICE_TOKEN = Symbol('IUserService');
/**
 * Service interface for User domain operations
 * Defines the contract for user business logic
 */
export interface IUserService {
  /**
   * Find a user by its unique identifier
   */
  findById(id: string): Promise<User | null>;

  /**
   * Find a user by email address
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Create a new user with validation
   */
  createUser(createUserDto: CreateUserDto): Promise<User>;

  /**
   * Update an existing user
   */
  updateUser(id: string, updates: Partial<User>): Promise<User>;

  /**
   * Delete a user by its unique identifier
   */
  deleteUser(id: string): Promise<void>;

  /**
   * Validate user credentials
   */
  validateCredentials(email: string, password: string): Promise<User | null>;

  /**
   * Get all users with optional pagination
   */
  getAllUsers(limit?: number, offset?: number): Promise<User[]>;
}
