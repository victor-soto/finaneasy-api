import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import {
  ITransactionService,
  TRANSACTION_SERVICE_TOKEN,
} from '@/domain/services/transaction.service.interface';
import { CreateTransactionInput } from '../inputs/create-transaction.input';
import { TransactionGraphQL } from '../entities/transaction.graphql.entity';

@Resolver(() => TransactionGraphQL)
export class TransactionResolver {
  constructor(
    @Inject(TRANSACTION_SERVICE_TOKEN)
    private readonly transactionService: ITransactionService,
  ) {}

  @Query(() => TransactionGraphQL, { nullable: true })
  async transaction(
    @Args('id') id: string,
  ): Promise<TransactionGraphQL | null> {
    const transaction = await this.transactionService.findById(id);
    return transaction ? TransactionGraphQL.fromDomain(transaction) : null;
  }

  @Mutation(() => TransactionGraphQL)
  async createTransaction(
    @Args('input') input: CreateTransactionInput,
  ): Promise<TransactionGraphQL> {
    // Validation happens in the input adapter
    const createTransactionDto = input.toDomainDto();
    const transaction =
      await this.transactionService.createTransaction(createTransactionDto);
    return TransactionGraphQL.fromDomain(transaction);
  }
}
