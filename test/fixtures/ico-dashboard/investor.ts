import { ObjectID } from 'mongodb';

module.exports = [
  {
    _id: new ObjectID.createFromHexString('59f075eda6cca00fbd486167'),
    email: 'user1@user.com',
    firstName: 'John',
    lastName: 'Smith',
    phone: '+7-999-999-99-99',
    country: 'Russia',
    dob: '1990-20-07',
    passwordHash: '$2a$10$Eik6dOKrE49vZKIxoMqyGuAWS0aUBI1H9R4G5GhFzsyqKFlvcG6gG',
    agreeTos: true,
    isVerified: true,
    defaultVerificationMethod: 'google_auth',
    referralCode: 'some referral code',
    referral: 'some referral',
    kycStatus: 'verified',
    source: 'unknown',
    verification: {
      id: 'verificationId',
      method: 'google_auth',
      attempts: 1,
      expiredOn: 1518504678
    },
    ethWallet: {
      ticker: 'ETH',
      address: '0x6b78c67Bf14eEA09ce74e18A1f5Eb0D9403B4492',
      balance: '0',
      salt: 'XRezhQCkOAfqPOQjuaOmty/rlU0dAz+UUFJALGktgdWnH2E/AjFIurtkvqQ3MG+S4gfnGOA/HADoGOGvnrTaxEjYQKF7QXzcWF9Fiz4=',
      mnemonic: 'GCrEsUMMY/S5UETJ0YgyVdzcWt5s/z37qhs06DsNQ7ULPpfDkGv2pJwWhhH3zSqYIkDU+fbzv6x3iDeiRWDrw1q6CEd9OXOeaKzcysB9Yg84l7IgsR5Ini7xhbFaYYWM0O0cKVbxgMbHZXZyaXQXGkLFqRovUPD3'
    },
    invitees: [],
    kycInitResult: {
      timestamp: 1518504678
    }
  },
  {
    _id: new ObjectID.createFromHexString('59f07e23b41f6373f64a8dcb'),
    email: 'user2@user.com',
    firstName: 'Vincent',
    lastName: 'Vega',
    phone: '+7-999-999-99-99',
    country: 'England',
    dob: '1990-20-07',
    passwordHash: '$2a$10$Eik6dOKrE49vZKIxoMqyGuAWS0aUBI1H9R4G5GhFzsyqKFlvcG6gG',
    agreeTos: true,
    isVerified: true,
    defaultVerificationMethod: 'google_auth',
    referralCode: 'some referral code',
    referral: 'some referral',
    kycStatus: 'verified',
    source: 'unknown',
    verification: {
      id: 'verificationId',
      method: 'google_auth',
      attempts: 1,
      expiredOn: 1518504678
    },
    ethWallet: {
      ticker: 'ETH',
      address: '0x6b78c67Bf14eEA09ce74e18A1f5Eb0D9403B4492',
      balance: '0',
      salt: 'XRezhQCkOAfqPOQjuaOmty/rlU0dAz+UUFJALGktgdWnH2E/AjFIurtkvqQ3MG+S4gfnGOA/HADoGOGvnrTaxEjYQKF7QXzcWF9Fiz4=',
      mnemonic: 'GCrEsUMMY/S5UETJ0YgyVdzcWt5s/z37qhs06DsNQ7ULPpfDkGv2pJwWhhH3zSqYIkDU+fbzv6x3iDeiRWDrw1q6CEd9OXOeaKzcysB9Yg84l7IgsR5Ini7xhbFaYYWM0O0cKVbxgMbHZXZyaXQXGkLFqRovUPD3'
    },
    invitees: [],
    kycInitResult: {
      timestamp: 1518504678
    }
  }
];
