import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@/domain/entities/user.entity';
import { TransactionEntity } from '@/infrastructure/persistence/entities/transaction.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.user)
  transactions: TransactionEntity[];

  /**
   * Converts the TypeORM entity to a domain entity
   */
  toDomain(): User {
    return new User(
      this.id,
      this.email,
      this.firstName,
      this.lastName,
      this.password,
      this.createdAt,
      this.updatedAt,
      this.transactions.map((transaction) => transaction.toDomain()),
    );
  }

  /**
   * Creates a TypeORM entity from a domain entity
   */
  static fromDomain(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.email = user.email;
    entity.firstName = user.firstName;
    entity.lastName = user.lastName;
    entity.password = user.password;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    return entity;
  }

  /**
   * Creates a TypeORM entity from user creation data
   */
  static fromCreateData(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ): UserEntity {
    const entity = new UserEntity();
    entity.email = email;
    entity.firstName = firstName;
    entity.lastName = lastName;
    entity.password = password;
    return entity;
  }
}
