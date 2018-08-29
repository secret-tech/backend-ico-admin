import * as chai from 'chai';
import { container } from '../../ioc.container';
import { TransactionServiceInterface, TransactionServiceType } from '../transaction.service';
import { NotFound, WrongRequestParameterValue } from '../../exceptions/exceptions';

require('../../../test/load.fixtures');

const { expect } = chai;

const transactionService = container.get<TransactionServiceInterface>(TransactionServiceType);

describe('Transaction Service', () => {
  it('should get list of transactions with ETH type', async() => {
    const params = {
      type: 'ETH'
    };
    const transactions = await transactionService.getList(params);

    expect(transactions.data).to.deep.equal([
      {
        id: '5b5042ab44f9c60012eb8611',
        transactionHash: '0x06ad42c56d54405dd6fa89ccd2f7eb3a928a8ae444f12515a33bf7a56779ac76',
        status: 'confirmed',
        type: 'ETH',
        amount: 1,
        timestamp: 1509294446
      },
      {
        id: '5b5042ab44f9c60012eb8612',
        transactionHash: '0x06ad42c56d54405dd6fa89ccd2f7eb3a928a8ae444f12515a33bf7a56779ac77',
        status: 'confirmed',
        type: 'ETH',
        amount: 1,
        timestamp: 1509294446
      }
    ]);
  });

  it('should get list of transactions with TOKEN type', async() => {
    const params = {
      type: 'TOKEN'
    };
    const transactions = await transactionService.getList(params);

    expect(transactions.data).to.deep.equal([
      {
        id: '5b5042ab44f9c60012eb861f',
        transactionHash: '0x06ad42c56d54405dd6fa89ccd2f7eb3a928a8ae444f12515a33bf7a56779ac75',
        status: 'confirmed',
        type: 'TOKEN',
        amount: 26600000,
        timestamp: 1509294446
      },
      {
        id: '5b5042ab44f9c60012eb8613',
        transactionHash: '0x06ad42c56d54405dd6fa89ccd2f7eb3a928a8ae444f12515a33bf7a56779ac78',
        status: 'confirmed',
        type: 'TOKEN',
        amount: 26600000,
        timestamp: 1509294446
      }
    ]);
  });

  it('should throw execption with wrong type', async() => {
    const params = {
      type: 'WRONG'
    };

    expect(transactionService.getList(params)).to.be.rejectedWith(WrongRequestParameterValue);
  });

  it('should get list of transactions with walletAddress', async() => {
    const params = {
      walletAddress: '0x6b78c67Bf14eEA09ce74e18A1f5Eb0D9403B4492'
    };
    const transactions = await transactionService.getList(params);

    expect(transactions.data).to.deep.equal([
      {
        id: '5b5042ab44f9c60012eb861f',
        transactionHash: '0x06ad42c56d54405dd6fa89ccd2f7eb3a928a8ae444f12515a33bf7a56779ac75',
        status: 'confirmed',
        type: 'TOKEN',
        amount: 26600000,
        direction: 'OUT',
        timestamp: 1509294446
      },
      {
        id: '5b5042ab44f9c60012eb8611',
        transactionHash: '0x06ad42c56d54405dd6fa89ccd2f7eb3a928a8ae444f12515a33bf7a56779ac76',
        status: 'confirmed',
        type: 'ETH',
        amount: 1,
        direction: 'OUT',
        timestamp: 1509294446,
      },
      {
        id: '5b5042ab44f9c60012eb8612',
        transactionHash: '0x06ad42c56d54405dd6fa89ccd2f7eb3a928a8ae444f12515a33bf7a56779ac77',
        status: 'confirmed',
        type: 'ETH',
        amount: 1,
        direction: 'IN',
        timestamp: 1509294446
      },
      {
        id: '5b5042ab44f9c60012eb8613',
        transactionHash: '0x06ad42c56d54405dd6fa89ccd2f7eb3a928a8ae444f12515a33bf7a56779ac78',
        status: 'confirmed',
        type: 'TOKEN',
        amount: 26600000,
        direction: 'IN',
        timestamp: 1509294446
      }
    ]);
  });

  it('should get list of transactions with walletAddress and direction IN', async() => {
    const params = {
      walletAddress: '0x6b78c67Bf14eEA09ce74e18A1f5Eb0D9403B4492',
      direction: 'IN'
    };
    const transactions = await transactionService.getList(params);

    expect(transactions.data).to.deep.equal([
      {
        id: '5b5042ab44f9c60012eb8612',
        transactionHash: '0x06ad42c56d54405dd6fa89ccd2f7eb3a928a8ae444f12515a33bf7a56779ac77',
        status: 'confirmed',
        type: 'ETH',
        amount: 1,
        direction: 'IN',
        timestamp: 1509294446
      },
      {
        id: '5b5042ab44f9c60012eb8613',
        transactionHash: '0x06ad42c56d54405dd6fa89ccd2f7eb3a928a8ae444f12515a33bf7a56779ac78',
        status: 'confirmed',
        type: 'TOKEN',
        amount: 26600000,
        direction: 'IN',
        timestamp: 1509294446
      }
    ]);
  });

  it('should get list of transactions with walletAddress and direction OUT', async() => {
    const params = {
      walletAddress: '0x6b78c67Bf14eEA09ce74e18A1f5Eb0D9403B4492',
      direction: 'OUT'
    };
    const transactions = await transactionService.getList(params);

    expect(transactions.data).to.deep.equal([
      {
        id: '5b5042ab44f9c60012eb861f',
        transactionHash: '0x06ad42c56d54405dd6fa89ccd2f7eb3a928a8ae444f12515a33bf7a56779ac75',
        status: 'confirmed',
        type: 'TOKEN',
        amount: 26600000,
        direction: 'OUT',
        timestamp: 1509294446
      },
      {
        id: '5b5042ab44f9c60012eb8611',
        transactionHash: '0x06ad42c56d54405dd6fa89ccd2f7eb3a928a8ae444f12515a33bf7a56779ac76',
        status: 'confirmed',
        type: 'ETH',
        amount: 1,
        direction: 'OUT',
        timestamp: 1509294446
      }
    ]);
  });

  it('should throw execption with walletAddress and wrong direction', async() => {
    const params = {
      walletAddress: '0x6b78c67Bf14eEA09ce74e18A1f5Eb0D9403B4492',
      direction: 'wrong'
    };

    expect(transactionService.getList(params)).to.be.rejectedWith(WrongRequestParameterValue);
  });
});
