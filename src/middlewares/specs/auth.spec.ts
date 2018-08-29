import * as chai from 'chai';
import { cleanUpMetadata } from 'inversify-express-utils';
import { Auth } from '../auth';
import { container } from '../../ioc.container';
import { AuthClient, AuthClientInterface, AuthClientType } from '../../services/auth.client';
import * as express from 'express';
import { Application, NextFunction, Request, Response } from 'express';
import * as TypeMoq from 'typemoq';

const {expect, request} = chai;

const authMock = TypeMoq.Mock.ofType(AuthClient);
authMock.setup(x => x.verifyUserToken(TypeMoq.It.isValue('token_without_user')))
  .returns(async(): Promise<any> => {
    return {
      login: 'not_exist@test.ru'
    };
  });
container.rebind<AuthClientInterface>(AuthClientType).toConstantValue(authMock.object);

const authClient = container.get<AuthClientInterface>(AuthClientType);
const auth = new Auth(authClient);

const app: Application = express();
app.use((req: Request, res: Response, next: NextFunction) => auth.authenticate(req, res, next));

describe('Auth Middleware', () => {
  describe('Test Auth', () => {
    it('should require Authorization header', (done) => {
      request(app).get('/smth').end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it('should require Bearer', (done) => {
      request(app).get('/smth').set('Authorization', 'Something').end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it('should not auth incorrect token', (done) => {
      request(app).get('/smth').set('Authorization', 'Bearer token').end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it('should throw error when user is not found', (done) => {
      request(app).get('/smth').set('Authorization', 'Bearer token_without_user').end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });
});
