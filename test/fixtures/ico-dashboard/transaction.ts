import { ObjectID } from 'mongodb';

module .exports = [
  {
    _id: new ObjectID.createFromHexString('5b5042ab44f9c60012eb861f'),
    transactionHash: '0x06ad42c56d54405dd6fa89ccd2f7eb3a928a8ae444f12515a33bf7a56779ac75',
    timestamp: 1509294446,
    blockNumber: 1965177,
    from: '0x6b78c67Bf14eEA09ce74e18A1f5Eb0D9403B4492',
    to: '0x6b78c67Bf14eEA09ce74e18A1f5Eb0D9403B4493',
    ethAmount: '0',
    tokenAmount: '26600000',
    status: 'confirmed',
    type: 'token_transfer'
  },
  {
    _id: new ObjectID.createFromHexString('5b5042ab44f9c60012eb8611'),
    transactionHash: '0x06ad42c56d54405dd6fa89ccd2f7eb3a928a8ae444f12515a33bf7a56779ac76',
    timestamp: 1509294446,
    blockNumber: 1965177,
    from: '0x6b78c67Bf14eEA09ce74e18A1f5Eb0D9403B4492',
    to: '0x6b78c67Bf14eEA09ce74e18A1f5Eb0D9403B4493',
    ethAmount: '1',
    tokenAmount: '0',
    status: 'confirmed',
    type: 'eth_transfer'
  },
  {
    _id: new ObjectID.createFromHexString('5b5042ab44f9c60012eb8612'),
    transactionHash: '0x06ad42c56d54405dd6fa89ccd2f7eb3a928a8ae444f12515a33bf7a56779ac77',
    timestamp: 1509294446,
    blockNumber: 1965177,
    from: '0x6b78c67Bf14eEA09ce74e18A1f5Eb0D9403B4493',
    to: '0x7672210729e053B2462D39CF3746A5d19B405aAD',
    ethAmount: '1',
    tokenAmount: '0',
    status: 'confirmed',
    type: 'eth_transfer'
  },
  {
    _id: new ObjectID.createFromHexString('5b5042ab44f9c60012eb8613'),
    transactionHash: '0x06ad42c56d54405dd6fa89ccd2f7eb3a928a8ae444f12515a33bf7a56779ac78',
    timestamp: 1509294446,
    blockNumber: 1965177,
    from: '0x6b78c67Bf14eEA09ce74e18A1f5Eb0D9403B4493',
    to: '0x6b78c67Bf14eEA09ce74e18A1f5Eb0D9403B4492',
    ethAmount: '0',
    tokenAmount: '26600000',
    status: 'confirmed',
    type: 'token_transfer'
  }
];