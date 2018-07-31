import { getConnection } from 'typeorm';
import { Investor } from '../entities/investor';
import { NotFound, WrongMethod } from '../exceptions/exceptions';
import * as transformers from '../transformers/transformers';
import { inject, injectable } from 'inversify';
import { ObjectID } from 'mongodb';
import * as bcrypt from 'bcrypt-nodejs';
import { Logger } from '../logger';
import { AuthClientType } from './auth.client';

export interface InvestorServiceInterface {
  getList(): Promise<InvestorResult[]>;
  getOne(investorId: any): Promise<InvestorResult>;
  update(investorId: any, inputInvestor: InputInvestor, tenantToken: string): Promise<InvestorResult>;
  accessUpdate(investorId: string, method: string): Promise<AccessUpdateResult>;
}

@injectable()
export class InvestorService implements InvestorServiceInterface {
  private logger = Logger.getInstance('INVESTOR_SERVICE');

  constructor(
    @inject(AuthClientType) private authClient: AuthClientInterface
  ) { }

  async getList(): Promise<InvestorResult[]> {
    const investors = await getConnection().getMongoRepository(Investor).find();

    /* istanbul ignore next */
    if (!investors) {
      throw new NotFound('Investors not found');
    }

    return transformers.transformInvestorList(investors);
  }

  async getOne(investorId: any): Promise<InvestorResult> {
    const investor = await getConnection().getMongoRepository(Investor).findOne(
      new ObjectID.createFromHexString(investorId)
    );

    if (!investor) {
      throw new NotFound('Investor not found');
    }

    return transformers.transformInvestor(investor);
  }

  async update(investorId: any, inputInvestor: InputInvestor, tenantToken: string): Promise<InvestorResult> {
    const investor = await getConnection().getMongoRepository(Investor).findOne(
      new ObjectID.createFromHexString(investorId)
    );

    if (!investor) {
      throw new NotFound('Investor not found');
    }

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

    /* istanbul ignore if */
    if (investor.hasOwnProperty('newPassword')) {
      logger.debug('Recreate investor user in auth');

      await this.authClient.createUser({
        email: investor.email.toLowerCase(),
        login: investor.email.toLowerCase(),
        password: investor.passwordHash,
        sub: investor.verification.id
      }, tenantToken);
    }

    return transformers.transformInvestor(investor);
  }

  async accessUpdate(investorId: string, method: string): Promise<AccessUpdateResult> {
    const investor = await getConnection().getMongoRepository(Investor).findOne(
      new ObjectID.createFromHexString(investorId)
    );

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
