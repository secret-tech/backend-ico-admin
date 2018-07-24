import { controller, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { AuthClientType } from '../services/auth.client';
import { Response, Request } from 'express';

@controller(
  '',
  'OnlyAcceptApplicationJson'
)
export class TenantController {
  constructor(
    @inject(AuthClientType) private authClient: AuthClientInterface
  ) {}

  @httpPost(
    '/login',
    'InitiateLoginValidation'
  )
  async initiateLogin(req: Request, res: Response): Promise<void> {
    res.json(await this.authClient.loginTenant(req.body.email, req.body.password));
  }
}