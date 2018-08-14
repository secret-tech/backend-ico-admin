import * as chai from 'chai';

require('../../../test/load.fixtures');

import { container } from '../../ioc.container';
import { InvestorServiceInterface, InvestorServiceType } from '../investor.service';
import { NotFound, WrongMethod } from '../../exceptions/exceptions';
import { AuthClient, AuthClientInterface, AuthClientType } from '../auth.client';
import * as TypeMoq from 'typemoq';

const { expect } = chai;

const authMock = TypeMoq.Mock.ofType(AuthClient);
authMock.setup(x => x.createUser(TypeMoq.It.isAny())).returns(async(): Promise<any> => {
  return {};
});
container.rebind<AuthClientInterface>(AuthClientType).toConstantValue(authMock.object);

const investorService = container.get<InvestorServiceInterface>(InvestorServiceType);

describe('Investor Service', () => {
  it('should get list of Investors',  async() => {
    const investors = await investorService.getList();

    expect(investors).to.deep.equal([
      {
        investorId: '59f075eda6cca00fbd486167',
        email: 'user1@user.com',
        name: 'John Smith',
        firstName: 'John',
        lastName: 'Smith',
        country: 'Russia',
        dob: '1990-07-20',
        phone: '+79999999999',
        ethAddress: '0x6b78c67Bf14eEA09ce74e18A1f5Eb0D9403B4492',
        kycStatus: 'verified',
        amountDeposited: 0,
        amountInvested: 0
      },
      {
        investorId: '59f07e23b41f6373f64a8dcb',
        email: 'user2@user.com',
        name: 'Vincent Vega',
        firstName: 'Vincent',
        lastName: 'Vega',
        country: 'England',
        dob: '1990-07-20',
        phone: '+79999999999',
        ethAddress: '0x6b78c67Bf14eEA09ce74e18A1f5Eb0D9403B4492',
        kycStatus: 'verified',
        amountDeposited: 0,
        amountInvested: 0
      }
    ]);
  });

  it('should get one Investor', async() => {
    const investor = await investorService.getOne('59f07e23b41f6373f64a8dcb');

    expect(investor).to.deep.equal({
      email: 'user2@user.com',
      name: 'Vincent Vega',
      firstName: 'Vincent',
      lastName: 'Vega',
      country: 'England',
      dob: '1990-07-20',
      phone: '+79999999999',
      ethAddress: '0x6b78c67Bf14eEA09ce74e18A1f5Eb0D9403B4492',
      kycStatus: 'verified',
      amountDeposited: 0,
      amountInvested: 0
    });
  });

  it('should throw exception while getOne Investor', async() => {
    expect(investorService.getOne('5b57dc7741857601dff7c4e4')).to.be.rejectedWith(NotFound);
  });

  it('should update Investor', async() => {
    const investorId = '59f07e23b41f6373f64a8dcb';
    const inputInvestor = {
      firstName: 'newFirstName',
      lastName: 'newLastName',
      country: 'Brazil',
      dob: '1992-02-18',
      phone: '+79998888888',
      newPassword: 'newPassword123',
      kycStatus: 'verified'
    };

    const investor = await investorService.update(investorId, inputInvestor);

    expect(investor).to.deep.eq({
      email: 'user2@user.com',
      name: 'newFirstName newLastName',
      firstName: 'newFirstName',
      lastName: 'newLastName',
      country: 'Brazil',
      dob: '1992-02-18',
      phone: '+79998888888',
      ethAddress: '0x6b78c67Bf14eEA09ce74e18A1f5Eb0D9403B4492',
      kycStatus: 'verified',
      amountDeposited: 0,
      amountInvested: 0
    });
  });

  it('should throw exception while update Investor', async() => {
    const investorId = '5b57dc7741857601dff7c4e6';
    const inputInvestor = {
      firstName: 'newFirstName',
      lastName: 'newLastName',
      country: 'Brazil',
      dob: '1992-02-18',
      phone: '+79998888888',
      newPassword: 'newPassword123',
      kycStatus: 'verified'
    };
    const tenantToken = 'verified_token';

    expect(investorService.update(investorId, inputInvestor)).to.be.rejectedWith(NotFound);
  });

  it('should activate investor', async() => {
    const investorId = '59f07e23b41f6373f64a8dcb';

    const investor = await investorService.accessUpdate(investorId, 'activate');

    expect(investor).to.deep.equal({
      consumer: 'user2@user.com'
    });
  });

  it('should deactivate investor', async() => {
    const investorId = '59f07e23b41f6373f64a8dcb';

    const investor = await investorService.accessUpdate(investorId, 'deactivate');

    expect(investor).to.deep.equal({
      consumer: 'user2@user.com'
    });
  });

  it('should throw exception when access update method is wrong', async() => {
    const investorId = '59f07e23b41f6373f64a8dcb';

    expect(investorService.accessUpdate(investorId, 'wrong')).to.be.rejectedWith(WrongMethod);
  });

  it('should throw exception while access update method when investorId is wrong', async() => {
    const investorId = '59f07e23b41f6373f64a8dc9';

    expect(investorService.accessUpdate(investorId, 'activate')).to.be.rejectedWith(NotFound);
  });
});
