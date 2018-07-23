import * as chai from "chai";
import * as factory from './test.app.factory';
import { cleanUpMetadata } from 'inversify-express-utils';
require('../../../test/load.fixtures');

chai.use(require('chai-http'));
const {expect, request} = chai;

const postRequest = (customApp, url: string) => {
  return request(customApp)
    .post(url)
    .set('Accept', 'application/json');
};

const getRequest = (customApp, url: string) => {
  return request(customApp)
    .get(url)
    .set('Accept', 'application/json');
};

describe('Tenant Controller', () => {
  beforeEach(async() => {
    cleanUpMetadata();
  });

  describe('POST /login', () => {
    it('should get tenant token', (done) => {
      const params = {
        email: 'test@test.com',
        password: 'Password1'
      };

      postRequest(factory.testApp(), '/login').send(params).end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({
          accessToken: 'new_token'
        });
        done();
      });
    });

    it('should require email', (done) => {
      const params = {};

      postRequest(factory.testApp(), '/login').send(params).end((err, res) => {
        expect(res.status).to.equal(422);
        expect(res.body.message).to.equal("\"email\" is required");
        done();
      });
    });

    it('should require password', (done) => {
      const params = {
        email: 'test@test.com'
      };

      postRequest(factory.testApp(), '/login').send(params).end((err, res) => {
        expect(res.status).to.equal(422);
        expect(res.body.message).to.equal("\"password\" is required");
        done();
      });
    });
  });
});