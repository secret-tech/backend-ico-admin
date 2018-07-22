import { Response, NextFunction } from 'express';
import { AuthorizedRequest } from '../requests/authorized.request';
import { responseErrorWithObject } from '../helpers/responses';

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

    try {
      const verifyResult = await this.authClient.verifyTenantToken(token);
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
