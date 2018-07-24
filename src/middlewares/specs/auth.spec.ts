import * as chai from 'chai';
import { cleanUpMetadata } from 'inversify-express-utils';
import { Auth } from '../auth';
import { container } from '../../ioc.container';
import { AuthClientType } from '../../services/auth.client';
import * as express from 'express';
import { Application, NextFunction, Request, Response } from 'express';

chai.use(require('chai-http'));
const {expect, request} = chai;

const authClient = container.get<AuthClientInterface>(AuthClientType);
const auth = new Auth(authClient);

const app: Application = express();
app.use((req: Request, res: Response, next: NextFunction) => auth.authenticate(req, res, next));

describe('Auth Middleware', () => {
  beforeEach(async() => {
    cleanUpMetadata();
  });

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
  });
});
