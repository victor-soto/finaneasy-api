import { Injectable, Inject } from '@nestjs/common';
import { IUserService } from '@/domain/services/user.service.interface';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@/domain/repositories/user.repository.interface';
import { User } from '@/domain/entities/user.entity';
import { CreateUserDto } from '@/domain/dtos/create-user.dto';

/**
 * Application service implementation for User domain operations
 * Implements the domain service interface
 */
@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // Domain validation
    if (!createUserDto.isValid()) {
      const errors = createUserDto.getValidationErrors();
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    return this.userRepository.create(createUserDto);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Create updated user instance
    const updatedUser = new User(
      existingUser.id,
      updates.email ?? existingUser.email,
      updates.firstName ?? existingUser.firstName,
      updates.lastName ?? existingUser.lastName,
      updates.password ?? existingUser.password,
      existingUser.createdAt,
      new Date(),
      existingUser.transactions,
    );

    return this.userRepository.update(updatedUser);
  }

  async deleteUser(id: string): Promise<void> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    await this.userRepository.delete(id);
  }

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    // In a real application, you would hash and compare passwords
    if (user.password !== password) {
      return null;
    }

    return user;
  }

  async getAllUsers(limit?: number, offset?: number): Promise<User[]> {
    return this.userRepository.findAll(limit, offset);
  }
}
