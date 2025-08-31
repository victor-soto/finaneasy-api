import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Transaction } from '@/domain/entities/transaction.entity';
import { TransactionType } from '@/domain/entities/interfaces/domain.entities.interface';
import { UserGraphQL } from './user.graphql.entity';

// Register the enum for GraphQL
registerEnumType(TransactionType, {
  name: 'TransactionType',
  description: 'The type of transaction',
});

/**
 * GraphQL adapter for Transaction domain entity
 * Maps domain entity to GraphQL schema
 */
@ObjectType()
export class TransactionGraphQL {
  @Field(() => ID)
  id: string;

  @Field()
  amount: number;

  @Field()
  description: string;

  @Field(() => TransactionType)
  transactionType: TransactionType;

  @Field({ nullable: true })
  category?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  signedAmount: number;

  @Field(() => UserGraphQL, { nullable: true })
  user?: UserGraphQL;

  /**
   * Converts domain entity to GraphQL entity
   */
  static fromDomain(transaction: Transaction): TransactionGraphQL {
    const graphqlTransaction = new TransactionGraphQL();
    graphqlTransaction.id = transaction.id;
    graphqlTransaction.amount = transaction.amount;
    graphqlTransaction.description = transaction.description;
    graphqlTransaction.transactionType = transaction.transactionType;
    graphqlTransaction.category = transaction.category;
    graphqlTransaction.createdAt = transaction.createdAt;
    graphqlTransaction.updatedAt = transaction.updatedAt;
    graphqlTransaction.signedAmount = transaction.getSignedAmount();

    if (transaction.user) {
      graphqlTransaction.user = UserGraphQL.fromDomain(transaction.user);
    }

    return graphqlTransaction;
  }
}
