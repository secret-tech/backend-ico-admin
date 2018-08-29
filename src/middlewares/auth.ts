import { Response, NextFunction } from 'express';
import { AuthorizedRequest } from '../requests/authorized.request';
import { responseErrorWithObject } from '../helpers/responses';
import { AuthClientInterface } from '../services/auth.client';
import { getConnection } from 'typeorm';
import { VerifiedToken } from '../entities/verified.token';
import { Investor } from '../entities/investor';
import { ErrorWithFields, NotFound } from '../exceptions/exceptions';

export class Auth {
  /**
   * constructor
   */
  constructor(
    private authClient: AuthClientInterface
  ) { }

  async authenticate(req: AuthorizedRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      return Auth.notAuthorized(res);
    }

    const parts = req.headers.authorization.split(' ');

    if (parts[0] !== 'Bearer') {
      return Auth.notAuthorized(res);
    }

    const token = parts[1];

    const tokenVerification = await getConnection().getMongoRepository(VerifiedToken).findOne({
      token: token
    });

    if (!tokenVerification || !tokenVerification.verified) {
      return Auth.notAuthorized(res);
    }

    try {
      const verifyResult = await this.authClient.verifyUserToken(token);

      const user = await getConnection().getMongoRepository(Investor).findOne({
        email: verifyResult.login
      });

      if (!user) {
        responseErrorWithObject(res, {
          'message': 'User is not found'
        }, 404);
      }

      if (!verifyResult.scope || verifyResult.scope !== 'ico-admin') {
        responseErrorWithObject(res, {
          'message': 'You don\'t have permission'
        }, 403);
      }

      return next();
    } catch (e) {
      return Auth.notAuthorized(res);
    }
  }

  static notAuthorized(res: Response) {
    responseErrorWithObject(res, {
      'message': 'Not Authorized'
    }, 401);
  }
}
