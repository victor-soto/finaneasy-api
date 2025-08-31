import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { User } from '@/domain/entities/user.entity';
import { CreateUserDto } from '@/domain/dtos/create-user.dto';
import { UserEntity } from '../entities/user.entity';

/**
 * TypeORM implementation of User repository
 * Implements the domain repository interface
 */
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const entity = await this.userRepo.findOne({
      where: { id },
      relations: ['transactions'],
    });
    return entity ? entity.toDomain() : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.userRepo.findOne({
      where: { email },
      relations: ['transactions'],
    });
    return entity ? entity.toDomain() : null;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const entity = UserEntity.fromCreateData(
      createUserDto.email,
      createUserDto.firstName,
      createUserDto.lastName,
      createUserDto.password,
    );
    const savedEntity = await this.userRepo.save(entity);
    return savedEntity.toDomain();
  }

  async update(user: User): Promise<User> {
    const entity = UserEntity.fromDomain(user);
    const updatedEntity = await this.userRepo.save(entity);
    return updatedEntity.toDomain();
  }

  async delete(id: string): Promise<void> {
    await this.userRepo.delete(id);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.userRepo.count({ where: { email } });
    return count > 0;
  }

  async findAll(limit?: number, offset?: number): Promise<User[]> {
    const entities = await this.userRepo.find({
      take: limit,
      skip: offset,
      relations: ['transactions'],
    });
    return entities.map((entity) => entity.toDomain());
  }
}
