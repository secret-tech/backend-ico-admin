import { getConnection } from 'typeorm';
import { Investor } from '../entities/investor';
import { NotFound } from '../exceptions/exceptions';
import * as transformers from '../transformers/transformers';
import { injectable } from 'inversify';
import { ObjectID } from 'mongodb';
import * as bcrypt from 'bcrypt-nodejs';

export interface InvestorServiceInterface {
  getList(): Promise<InvestorResult[]>;
  getOne(investorId: any): Promise<InvestorResult>;
  update(investorId: any, inputInvestor: InputInvestor): Promise<InvestorResult>;
}

@injectable()
export class InvestorService implements InvestorServiceInterface {
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

  async update(investorId: any, inputInvestor: InputInvestor): Promise<InvestorResult> {
    const investor = await getConnection().getMongoRepository(Investor).findOne(
      new ObjectID.createFromHexString(investorId)
    );

    if (!investor) {
      throw new NotFound('Investor not found');
    }

    const inputKeys = Object.keys(inputInvestor);

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

    return transformers.transformInvestor(investor);
  }
}

const InvestorServiceType = Symbol('InvestorServiceInterface');
export { InvestorServiceType };
