import { ObjectID } from 'mongodb';

module .exports = [
  {
    _id: new ObjectID.createFromHexString('5b6d56c577455a0013fc5fe5'),
    token: 'verified_token',
    verified: true
  },
  {
    _id: new ObjectID.createFromHexString('5b6d56c577455a0013fc5fe6'),
    token: 'token_without_user',
    verified: true
  }
];