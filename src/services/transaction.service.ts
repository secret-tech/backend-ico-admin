import { inject, injectable } from 'inversify';
import * as transformers from '../transformers/transformers';
import { ObjectID } from 'mongodb';
import { TransactionRepositoryInterface, TransactionRepositoryType } from './repositories/transaction.repository';

export interface TransactionServiceInterface {
  getList(queryParams: any): Promise<any>;
}

@injectable()
export class TransactionService implements TransactionServiceInterface {
  constructor(
    @inject(TransactionRepositoryType) private transactionRepository: TransactionRepositoryInterface
  ) {}
  async getList(queryParams: any): Promise<any> {
    const transactionParams = {
      type: queryParams.type || null,
      walletAddress: queryParams.walletAddress || null,
      direction: queryParams.direction || null
    };
    const pagination = {
      page: queryParams.page || 0,
      limit: queryParams.limit || 50
    };
    const sort = {
      sort: queryParams.sort || null,
      desc: queryParams.desc === 'true'
    };

    const count = await this.transactionRepository.getAllCountByParams(transactionParams);

    const transactions = await this.transactionRepository.getAllByParams(
      transactionParams,
      pagination,
      sort
    );

    const data = transformers.transformTransactionList(transactions);

    return {
      page: pagination.page,
      count: count,
      limit: pagination.limit,
      data: data
    };
  }
}

const TransactionServiceType = Symbol('TransactionServiceInterface');
export { TransactionServiceType };
