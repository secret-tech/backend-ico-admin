import { getConnection } from 'typeorm';
import { Investor } from '../entities/investor';
import { NotFound, WrongMethod } from '../exceptions/exceptions';
import * as transformers from '../transformers/transformers';
import { inject, injectable } from 'inversify';
import { ObjectID } from 'mongodb';
import * as bcrypt from 'bcrypt-nodejs';
import { Logger } from '../logger';
import { AuthClientInterface, AuthClientType } from './auth.client';
import { InvestorRepositoryInterface, InvestorRepositoryType } from './repositories/investor.repository';
import config from '../config';
import { TransactionRepositoryInterface, TransactionRepositoryType } from './repositories/transaction.repository';

export interface InvestorServiceInterface {
  getList(queryParams: any): Promise<any>;
  getOne(investorId: any): Promise<InvestorResult>;
  update(investorId: any, inputInvestor: InputInvestor): Promise<InvestorResult>;
  accessUpdate(investorId: string, method: string): Promise<AccessUpdateResult>;
}

@injectable()
export class InvestorService implements InvestorServiceInterface {
  private logger = Logger.getInstance('INVESTOR_SERVICE');

  constructor(
    @inject(AuthClientType) private authClient: AuthClientInterface,
    @inject(InvestorRepositoryType) private investorRepository: InvestorRepositoryInterface,
    @inject(TransactionRepositoryType) private transactionRepository: TransactionRepositoryInterface
  ) { }

  async getList(queryParams: any): Promise<any> {
    const investorParams = {
      country: queryParams.country || null,
      kycStatus: queryParams.kycStatus || null,
      search: queryParams.search || null
    };

    const pagination = {
      page: queryParams.page || 0,
      limit: queryParams.limit || 50
    };

    const sort = {
      sort: queryParams.sort || null,
      desc: queryParams.desc === 'true'
    };

    const count = await this.investorRepository.getAllCountByParams(investorParams);

    const investors = await this.investorRepository.getAllByParams(
      investorParams,
      pagination,
      sort
    );

    const data = investors ? transformers.transformInvestorList(investors) : [];

    return {
      page: pagination.page,
      count: count,
      limit: pagination.limit,
      data: data
    };
  }

  async getOne(investorId: any): Promise<InvestorResult> {
    const investor = await this.investorRepository.getOne(investorId);

    if (!investor) {
      throw new NotFound('Investor not found');
    }

    const transactionsOut = investor.ethWallet ? await this.transactionRepository.getAllWithParams({
      type: 'ETH',
      walletAddress: investor.ethWallet.address,
      direction: 'OUT'
    }) : [];

    const transactionsIn = investor.ethWallet ? await this.transactionRepository.getAllWithParams({
      type: 'ETH',
      walletAddress: investor.ethWallet.address,
      direction: 'IN'
    }) : [];

    return transformers.transformInvestor(investor, transactionsOut, transactionsIn);
  }

  async update(investorId: any, inputInvestor: InputInvestor): Promise<InvestorResult> {
    const investor = await this.investorRepository.getOne(investorId);

    if (!investor) {
      throw new NotFound('Investor not found');
    }

    const transactionsOut = investor.ethWallet ? await this.transactionRepository.getAllWithParams({
      type: 'ETH',
      walletAddress: investor.ethWallet.address,
      direction: 'OUT'
    }) : [];

    const transactionsIn = investor.ethWallet ? await this.transactionRepository.getAllWithParams({
      type: 'ETH',
      walletAddress: investor.ethWallet.address,
      direction: 'IN'
    }) : [];

    const logger = this.logger.sub({ email: investor.email }, '[update] ');

    const inputKeys = Object.keys(inputInvestor);

    logger.debug('Update Investor');

    inputKeys.forEach((key) => {
      switch (key) {
        case 'newPassword':
          investor.passwordHash = bcrypt.hashSync(inputInvestor.newPassword);
          break;
        default:
          if (investor.hasOwnProperty(key) && investor[key] !== inputInvestor[key]) {
            investor[key] = inputInvestor[key];
          }
          break;
      }
    });

    await getConnection().getMongoRepository(Investor).save(investor);

    /* istanbul ignore next */
    if (inputInvestor.hasOwnProperty('newPassword')) {
      logger.debug('Recreate investor user in auth');

      await this.authClient.createUser({
        email: investor.email.toLowerCase(),
        login: investor.email.toLowerCase(),
        password: investor.passwordHash,
        sub: investor.verification.id
      });
    }

    return transformers.transformInvestor(investor, transactionsOut, transactionsIn);
  }

  async accessUpdate(investorId: string, method: string): Promise<AccessUpdateResult> {
    const investor = await this.investorRepository.getOne(investorId);

    if (!investor) {
      throw new NotFound('Investor not found');
    }

    switch (method) {
      case 'activate':
        investor.isVerified = true;
        break;
      case 'deactivate':
        investor.isVerified = false;
        break;
      default:
        throw new WrongMethod('Wrong method for update investor access');
    }

    await getConnection().getMongoRepository(Investor).save(investor);

    return transformers.transformAccessUpdate(investor);
  }
}

const InvestorServiceType = Symbol('InvestorServiceInterface');
export { InvestorServiceType };
