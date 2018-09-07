import { injectable } from 'inversify';
import { getConnection, getMongoManager } from 'typeorm';
import { Investor } from '../../entities/investor';
import { ObjectID } from 'mongodb';
import { Transaction } from '../../entities/transaction';

export interface InvestorRepositoryInterface {
  getAllByParams(investorParams: InvestorInputParams, pagination: PaginationParams, sortParams: SortParams): Promise<any>;
  getAllCountByParams(investorParams: InvestorInputParams): Promise<number>;
  getOne(investorId: any): Promise<Investor>;
}

@injectable()
export class InvestorRepository implements InvestorRepositoryInterface {
  private query: any;
  private order: any;

  async getAllByParams(investorParams: InvestorInputParams, pagination: PaginationParams, sortParams: SortParams): Promise<any> {
    this.buildQueryGetAllByParams(investorParams);

    this.buildOrder(sortParams);

    const page = pagination.page;
    const limit = pagination.limit;
    const skip = page * limit;

    return getConnection().getMongoRepository(Investor).aggregate([
      {
        $match: this.query
      },
      {
        $lookup: {
          from: 'transaction',
          localField: 'ethWallet.address',
          foreignField: 'from',
          as: 'transactions_out'
        }
      },
      {
        $lookup: {
          from: 'transaction',
          localField: 'ethWallet.address',
          foreignField: 'to',
          as: 'transactions_in'
        }
      },
      {
        $sort: this.order
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]).toArray();
  }

  async getAllCountByParams(investorParams: InvestorInputParams): Promise<number> {
    this.buildQueryGetAllByParams(investorParams);

    return getMongoManager().createEntityCursor(Investor, this.query).count(false);
  }

  async getOne(investorId: any): Promise<any> {
    return getConnection().getMongoRepository(Investor).findOne(
      new ObjectID.createFromHexString(investorId)
    );
  }

  private buildQueryGetAllByParams(investorParams: InvestorInputParams): void {
    this.query = {};

    if (investorParams.kycStatus) {
      this.pushAndInMongoQuery({
        'kycStatus': investorParams.kycStatus
      });
    }

    if (investorParams.country) {
      this.pushAndInMongoQuery({
        'country': investorParams.country
      });
    }

    if (investorParams.search) {
      this.pushAndInMongoQuery({
        $or: [
          {
            'firstName': {
              $regex: investorParams.search,
              $options: 'i'
            }
          },
          {
            'lastName': {
              $regex: investorParams.search,
              $options: 'i'
            }
          },
          {
            'email': {
              $regex: investorParams.search,
              $options: 'i'
            }
          }
        ]
      });
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

const InvestorRepositoryType = Symbol('InvestorRepositoryInterface');
export { InvestorRepositoryType };
