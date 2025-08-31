import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '@/domain/entities/user.entity';
import { TransactionGraphQL } from './transaction.graphql.entity';

/**
 * GraphQL adapter for User domain entity
 * Maps domain entity to GraphQL schema
 */
@ObjectType()
export class UserGraphQL {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  fullName: string;

  @Field(() => [TransactionGraphQL])
  transactions: TransactionGraphQL[];

  /**
   * Converts domain entity to GraphQL entity
   */
  static fromDomain(user: User): UserGraphQL {
    const graphqlUser = new UserGraphQL();
    graphqlUser.id = user.id;
    graphqlUser.email = user.email;
    graphqlUser.firstName = user.firstName;
    graphqlUser.lastName = user.lastName;
    graphqlUser.createdAt = user.createdAt;
    graphqlUser.updatedAt = user.updatedAt;
    graphqlUser.fullName = user.getFullName();
    graphqlUser.transactions = user.transactions.map((transaction) =>
      TransactionGraphQL.fromDomain(transaction),
    );
    return graphqlUser;
  }
}
