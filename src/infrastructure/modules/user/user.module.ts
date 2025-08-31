import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/infrastructure/persistence/entities/user.entity';
import { UserRepository } from '@/infrastructure/persistence/repositories/user.repository';
import { UserResolver } from '@/infrastructure/graphql/resolvers/user.resolver';
import { ZodValidationService } from '@/infrastructure/validation/zod-validation.service';
import { USER_REPOSITORY_TOKEN } from '@/domain/repositories/user.repository.interface';
import { ApplicationModule } from '@/application/application.module';
import { Repository } from 'typeorm';

/**
 * User Infrastructure Module
 *
 * Provides infrastructure adapters for User domain operations.
 * Imports ApplicationModule to get access to application services
 * without creating direct dependencies on application layer.
 *
 * Responsibilities:
 * - Database persistence (UserRepository)
 * - GraphQL API (UserResolver)
 * - Input validation (ZodValidationService)
 * - Module configuration and dependency injection
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ApplicationModule, // Import application services
  ],
  providers: [
    {
      provide: USER_REPOSITORY_TOKEN,
      useFactory: (repository: Repository<UserEntity>) =>
        new UserRepository(repository),
    },
    UserResolver,
    ZodValidationService,
  ],
  exports: [USER_REPOSITORY_TOKEN],
})
export class UserModule {}
