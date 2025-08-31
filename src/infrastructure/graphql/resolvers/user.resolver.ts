import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import {
  IUserService,
  USER_SERVICE_TOKEN,
} from '@/domain/services/user.service.interface';
import { CreateUserInput } from '../inputs/create-user.input';
import { UserGraphQL } from '../entities/user.graphql.entity';

@Resolver(() => UserGraphQL)
export class UserResolver {
  constructor(
    @Inject(USER_SERVICE_TOKEN)
    private readonly userService: IUserService,
  ) {}

  @Query(() => UserGraphQL, { nullable: true })
  async user(@Args('id') id: string): Promise<UserGraphQL | null> {
    const user = await this.userService.findById(id);
    return user ? UserGraphQL.fromDomain(user) : null;
  }

  @Mutation(() => UserGraphQL)
  async createUser(
    @Args('input') input: CreateUserInput,
  ): Promise<UserGraphQL> {
    // Validation happens in the input adapter
    const createUserDto = input.toDomainDto();
    const user = await this.userService.createUser(createUserDto);
    return UserGraphQL.fromDomain(user);
  }
}
