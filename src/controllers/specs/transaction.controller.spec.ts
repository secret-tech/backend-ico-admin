import * as chai from "chai";
import * as factory from './test.app.factory';
require('../../../test/load.fixtures');

const {expect, request} = chai;

const getRequest = (customApp, url: string) => {
  return request(customApp)
    .get(url)
    .set('Accept', 'application/json');
};

describe('Transaction Controller', () => {
  describe('GET /transactions', () => {
    it('should get list of transactions', (done) => {
      const params = {};
      const token = 'verified_token';

      getRequest(factory.testApp(), '/transactions').set('Authorization', `Bearer ${ token }`).query(params).end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.deep.equal([
          {
            id: '5b5042ab44f9c60012eb861f',
            transactionHash: '0x06ad42c56d54405dd6fa89ccd2f7eb3a928a8ae444f12515a33bf7a56779ac75',
            status: 'confirmed',
            type: 'TOKEN',
            amount: 26600000,
            timestamp: 1509294446
          },
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
        done();
      });
    });

    it('should get list of transactions with investorId', (done) => {
      const params = {
        walletAddress: '0x6b78c67Bf14eEA09ce74e18A1f5Eb0D9403B4493'
      };
      const token = 'verified_token';

      getRequest(factory.testApp(), '/transactions').set('Authorization', `Bearer ${ token }`).query(params).end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.deep.equal([
          {
            id: '5b5042ab44f9c60012eb861f',
            transactionHash: '0x06ad42c56d54405dd6fa89ccd2f7eb3a928a8ae444f12515a33bf7a56779ac75',
            status: 'confirmed',
            type: 'TOKEN',
            amount: 26600000,
            direction: 'IN',
            timestamp: 1509294446
          },
          {
            id: '5b5042ab44f9c60012eb8611',
            transactionHash: '0x06ad42c56d54405dd6fa89ccd2f7eb3a928a8ae444f12515a33bf7a56779ac76',
            status: 'confirmed',
            type: 'ETH',
            amount: 1,
            direction: 'IN',
            timestamp: 1509294446
          },
          {
            id: '5b5042ab44f9c60012eb8612',
            transactionHash: '0x06ad42c56d54405dd6fa89ccd2f7eb3a928a8ae444f12515a33bf7a56779ac77',
            status: 'confirmed',
            type: 'ETH',
            amount: 1,
            direction: 'OUT',
            timestamp: 1509294446
          },
          {
            id: '5b5042ab44f9c60012eb8613',
            transactionHash: '0x06ad42c56d54405dd6fa89ccd2f7eb3a928a8ae444f12515a33bf7a56779ac78',
            status: 'confirmed',
            type: 'TOKEN',
            amount: 26600000,
            direction: 'OUT',
            timestamp: 1509294446
          }
        ]);
        done();
      });
    });
  });
});
