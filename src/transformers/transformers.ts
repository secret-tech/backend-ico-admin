import { Investor } from '../entities/investor';

export function transformInvestorList(investors: Investor[]): InvestorResult[] {
  return investors.map(i => ({
    investorId: i.id.toHexString(),
    email: i.email,
    name: i.name,
    firstName: i.firstName,
    lastName: i.lastName,
    country: i.country,
    dob: i.dob,
    phone: i.phone,
    ethAddress: i.ethWallet.address,
    kycStatus: i.kycStatus,
    amountDeposited: 0,
    amountInvested: 0
  }));
}

export function transformInvestor(investor: Investor): InvestorResult {
  return {
    email: investor.email,
    name: investor.name,
    firstName: investor.firstName,
    lastName: investor.lastName,
    country: investor.country,
    dob: investor.dob,
    phone: investor.phone,
    ethAddress: investor.ethWallet.address,
    kycStatus: investor.kycStatus,
    amountDeposited: 0,
    amountInvested: 0
  };
}