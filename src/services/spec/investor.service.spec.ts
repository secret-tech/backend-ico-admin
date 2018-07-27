import * as chai from 'chai';

require('../../../test/load.fixtures');

import { container } from '../../ioc.container';
import { InvestorServiceInterface, InvestorServiceType } from '../investor.service';
import { NotFound } from '../../exceptions/exceptions';

const { expect } = chai;

const investorService = container.get<InvestorServiceInterface>(InvestorServiceType);

describe('Investor Service', () => {
  it('should get list of Investors',  async() => {
    const investors = await investorService.getList();

    expect(investors).is.not.empty;
  });

  it('should get one Investor', async() => {
    const investor = await investorService.getOne('59f07e23b41f6373f64a8dcb');

    expect(investor).is.not.empty;
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

  it('should throw execption while update Investor', async() => {
    const inputInvestor = {
      firstName: 'newFirstName',
      lastName: 'newLastName',
      country: 'Brazil',
      dob: '1992-02-18',
      phone: '+79998888888',
      newPassword: 'newPassword123',
      kycStatus: 'verified'
    };

    expect(investorService.update('5b57dc7741857601dff7c4e6', inputInvestor)).to.be.rejectedWith(NotFound);
  });
});