import { Investor } from '../entities/investor';
import config from '../config';
import { Transaction } from '../entities/transaction';

export function transformInvestorList(investors: any): InvestorResult[] {
  return investors.map(i => ({
    investorId: i._id.toHexString(),
    email: i.email,
    name: `${i.firstName} ${i.lastName}`,
    firstName: i.firstName,
    lastName: i.lastName,
    country: i.country,
    dob: i.dob,
    phone: i.phone,
    ethAddress: i.ethWallet ? i.ethWallet.address : null,
    kycStatus: i.kycStatus,
    amountDeposited: i.transactions_in.reduce((sum, tx) => sum + Number(tx.ethAmount), 0),
    amountInvested: i.transactions_out.reduce((sum, tx) => (tx.to === config.contracts.ico.address ? sum + Number(tx.ethAmount) : sum), 0)
  }));
}

export function transformInvestor(investor: Investor, transactionsOut: any, transactionsIn: any): InvestorResult {
  return {
    email: investor.email,
    name: investor.name,
    firstName: investor.firstName,
    lastName: investor.lastName,
    country: investor.country,
    dob: investor.dob,
    phone: investor.phone,
    ethAddress: investor.ethWallet ? investor.ethWallet.address : null,
    kycStatus: investor.kycStatus,
    amountDeposited: transactionsIn.reduce((sum, tx) => sum + Number(tx.ethAmount), 0),
    amountInvested: transactionsOut.reduce((sum, tx) => (tx.to === config.contracts.ico.address ? sum + Number(tx.ethAmount) : sum), 0)
  };
}

export function transformAccessUpdate(investor: Investor): AccessUpdateResult {
  return {
    consumer: investor.email
  };
}

export function transformTransactionList(transactions: any): TransactionResult[] {
  return transactions.map((t) => {
    let tx = {
      id: t._id.toHexString(),
      transactionHash: t.transactionHash,
      status: t.status,
      type: Number(t.ethAmount) > 0 ? 'ETH' : 'TOKEN',
      amount: t.amount,
      timestamp: t.timestamp,
    };

    if (t.direction) {
      tx['direction'] = t.direction;
    }

    return tx;
  });
}
