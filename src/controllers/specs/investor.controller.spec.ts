import * as chai from "chai";
import * as factory from './test.app.factory';
import * as TypeMoq from "typemoq";
import { AuthClient, AuthClientInterface, AuthClientType } from '../../services/auth.client';
import { container } from '../../ioc.container';
require('../../../test/load.fixtures');

const {expect, request} = chai;

const getRequest = (customApp, url: string) => {
  return request(customApp)
    .get(url)
    .set('Accept', 'application/json');
};

const putRequest = (customApp, url: string) => {
  return request(customApp)
    .put(url)
    .set('Accept', 'application/json');
};

describe('Investor controller', () => {
  describe('GET /investors', () => {
    it('should get Investors list', (done) => {
      const token = 'verified_token';

      getRequest(factory.testApp(), '/investors').set('Authorization', `Bearer ${ token }`).end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal([
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
            ethAddress: '0x6b78c67Bf14eEA09ce74e18A1f5Eb0D9403B4493',
            kycStatus: 'verified',
            amountDeposited: 0,
            amountInvested: 0
          },
          {
            investorId: '59f07e23b41f6373f64a8dc8',
            email: 'user3@user.com',
            name: 'Ivan Ivanov',
            firstName: 'Ivan',
            lastName: 'Ivanov',
            country: 'England',
            dob: '1990-05-23',
            phone: '+79999999999',
            ethAddress: null,
            kycStatus: 'not_verified',
            amountDeposited: 0,
            amountInvested: 0
          }
        ]);
        done();
      });
    });
  });
  describe('GET /investors/:investorId', () => {
    it('should get investor by id', (done) => {
      const investorId = '59f07e23b41f6373f64a8dcb';
      const token = 'verified_token';

      getRequest(factory.testApp(), `/investors/${ investorId }`).set('Authorization', `Bearer ${ token }`).end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({
          email: 'user2@user.com',
          name: 'Vincent Vega',
          firstName: 'Vincent',
          lastName: 'Vega',
          country: 'England',
          dob: '1990-07-20',
          phone: '+79999999999',
          ethAddress: '0x6b78c67Bf14eEA09ce74e18A1f5Eb0D9403B4493',
          kycStatus: 'verified',
          amountDeposited: 0,
          amountInvested: 0
        });
        done();
      });
    });
    it('should throw error when investorId is wrong', (done) => {
      const investorId = 'wrongId';
      const token = 'verified_token';

      getRequest(factory.testApp(), `/investors/${ investorId }`).set('Authorization', `Bearer ${ token }`).end((err, res) => {
        expect(res.status).to.equal(422);
        done();
      });
    });
    it('should throw error when investor not found', (done) => {
      const investorId = '59f07e23b41f6373f64a8dc0';
      const token = 'verified_token';

      getRequest(factory.testApp(), `/investors/${ investorId }`).set('Authorization', `Bearer ${ token }`).end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });

  describe('PUT /investors/:investorId', () => {
    it('should update Investor', (done) => {
      const investorId = '59f07e23b41f6373f64a8dcb';
      const token = 'verified_token';
      const params = {
        firstName: 'newFirstName',
        lastName: 'newLastName',
        country: 'Brazil',
        dob: '1992-02-18',
        phone: '+79998888888',
        newPassword: 'newPassword123',
        kycStatus: 'verified'
      };

      putRequest(factory.testApp(), `/investors/${ investorId }`).set('Authorization', `Bearer ${ token }`).send(params).end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({
          email: 'user2@user.com',
          name: 'newFirstName newLastName',
          firstName: 'newFirstName',
          lastName: 'newLastName',
          country: 'Brazil',
          dob: '1992-02-18',
          phone: '+79998888888',
          ethAddress: '0x6b78c67Bf14eEA09ce74e18A1f5Eb0D9403B4493',
          kycStatus: 'verified',
          amountDeposited: 0,
          amountInvested: 0
        });
        done();
      });
    });

    it('should return 404 status code when investorId is wrong', (done) => {
      const investorId = '59f07e23b41f6373f64a8dc9';
      const token = 'verified_token';
      const params = {
        firstName: 'newFirstName',
        lastName: 'newLastName',
        country: 'Brazil',
        dob: '1992-02-18',
        phone: '+79998888888',
        newPassword: 'newPassword123',
        kycStatus: 'verified'
      };

      putRequest(factory.testApp(), `/investors/${ investorId }`).set('Authorization', `Bearer ${ token }`).send(params).end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });

  describe('GET /investors/:investorId/:method', () => {
    it('should activate investor', (done) => {
      const investorId = '59f07e23b41f6373f64a8dcb';
      const token = 'verified_token';

      getRequest(factory.testApp(), `/investors/${ investorId }/activate`).set('Authorization', `Bearer ${ token }`).end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({
          consumer: 'user2@user.com'
        });
        done();
      });
    });

    it('should deactivate investor', (done) => {
      const investorId = '59f07e23b41f6373f64a8dcb';
      const token = 'verified_token';

      getRequest(factory.testApp(), `/investors/${ investorId }/deactivate`).set('Authorization', `Bearer ${ token }`).end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({
          consumer: 'user2@user.com'
        });
        done();
      });
    });

    it('should return 404 status code when investorId is wrong', (done) => {
      const investorId = '59f07e23b41f6373f64a8dc9';
      const token = 'verified_token';

      getRequest(factory.testApp(), `/investors/${ investorId }/activate`).set('Authorization', `Bearer ${ token }`).end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });

    it('should return 422 status code when investorId is not hex', (done) => {
      const investorId = 'wrongId';
      const token = 'verified_token';

      getRequest(factory.testApp(), `/investors/${ investorId }/activate`).set('Authorization', `Bearer ${ token }`).end((err, res) => {
        expect(res.status).to.equal(422);
        done();
      });
    });

    it('should return 422 status code when method is wrong', (done) => {
      const investorId = '59f07e23b41f6373f64a8dc9';
      const token = 'verified_token';

      getRequest(factory.testApp(), `/investors/${ investorId }/wrong`).set('Authorization', `Bearer ${ token }`).end((err, res) => {
        expect(res.status).to.equal(405);
        done();
      });
    });
  });
});
