import { Transaction } from '../../entities/transaction';
import { injectable } from 'inversify';
import { WrongRequestParameterValue } from '../../exceptions/exceptions';
import { getConnection, getMongoManager } from 'typeorm';

export interface TransactionRepositoryInterface {
  getAllWithPagination(transactionParams: TransactionInputParams, pagination: PaginationParams, sortParams: SortParams): Promise<any>;
  getAllCountByParams(transactionParams: TransactionInputParams): Promise<number>;
  getAllWithParams(transactionParams: TransactionInputParams): Promise<any>;
}

@injectable()
export class TransactionRepository implements TransactionRepositoryInterface {
  private query: any;
  private order: any;

  async getAllWithPagination(transactionParams: TransactionInputParams, pagination: PaginationParams, sortParams: SortParams): Promise<any> {
    const wallet = transactionParams.walletAddress || null;

    this.buildQueryGetAllByParams(transactionParams);

    this.buildOrder(sortParams);

    const page = pagination.page;
    const limit = pagination.limit;
    const skip = page * limit;

    const transactions = await getConnection().getMongoRepository(Transaction).aggregate([
      {
        '$match': this.query
      },
      {
        '$addFields': {
          'amount': {
            '$add': [
              {
                '$toDouble': '$ethAmount'
              },
              {
                '$toDouble': '$tokenAmount'
              }
            ]
          }
        }
      },
      {
        '$sort': this.order
      },
      {
        '$skip': skip
      },
      {
        '$limit': limit
      }
    ]).toArray();

    return wallet ? transactions.map(t => ({ ...t, direction: t.from === wallet ? 'OUT' : 'IN' })) : transactions;
  }

  async getAllCountByParams(transactionParams: TransactionInputParams): Promise<number> {
    this.buildQueryGetAllByParams(transactionParams);

    return getMongoManager().createEntityCursor(Transaction, this.query).count(false);
  }

  async getAllWithParams(transactionParams: TransactionInputParams): Promise<any> {
    const wallet = transactionParams.walletAddress || null;

    this.buildQueryGetAllByParams(transactionParams);

    const transactions = await getConnection().getMongoRepository(Transaction).aggregate([
      {
        '$match': this.query
      },
      {
        '$addFields': {
          'amount': {
            '$add': [
              {
                '$toDouble': '$ethAmount'
              },
              {
                '$toDouble': '$tokenAmount'
              }
            ]
          }
        }
      }
    ]).toArray();

    return wallet ? transactions.map(t => ({ ...t, direction: t.from === wallet ? 'OUT' : 'IN' })) : transactions;
  }

  private buildQueryGetAllByParams(transactionParams: TransactionInputParams): void {
    this.query = {};

    let wallet: string;

    if (transactionParams.type) {
      switch (transactionParams.type) {
        case 'ETH':
          this.pushAndInMongoQuery({
            'ethAmount': {
              '$ne': '0'
            }
          });
          break;
        case 'TOKEN':
          this.pushAndInMongoQuery({
            'tokenAmount': {
              '$ne': '0'
            }
          });
          break;
        default:
          throw new WrongRequestParameterValue('Value \'{{value}}\' of parameter \'{{param}}\' is wrong. It must be in {{in_values}}', {
            'value': transactionParams.type,
            'param': 'type',
            'in_values': '[\'ETH\', \'TOKEN\']'
          });
      }
    }

    if (transactionParams.walletAddress) {
      wallet = transactionParams.walletAddress;

      if (transactionParams.direction) {
        switch (transactionParams.direction) {
          case 'IN':
            this.pushAndInMongoQuery({
              'to': wallet
            });
            break;
          case 'OUT':
            this.pushAndInMongoQuery({
              'from': wallet
            });
            break;
          default:
            throw new WrongRequestParameterValue('Value \'{{value}}\' of parameter \'{{param}}\' is wrong. It must be in {{in_values}}', {
              'value': transactionParams.direction,
              'param': 'direction',
              'in_values': '[\'IN\', \'OUT\']'
            });
        }
      } else {
        this.pushAndInMongoQuery({
          '$or': [
            {
              'to': wallet
            },
            {
              'from': wallet
            }
          ]
        });
      }
    }
  }

  /* istanbul ignore next */
  private buildOrder(sortParams: SortParams): void {
    this.order = {};

    if (sortParams.sort) {
      this.order[sortParams.sort] = sortParams.desc ? -1 : 1;
    } else {
      this.order = {
        timestamp: -1
      };
    }
  }

  /* istanbul ignore next */
  private pushAndInMongoQuery(queryObject: any): void {
    if (!this.query.hasOwnProperty('$and')) {
      this.query.$and = [];
    }

    this.query.$and.push(queryObject);
  }
}

const TransactionRepositoryType = Symbol('TransactionRepositoryInterface');
export { TransactionRepositoryType };
