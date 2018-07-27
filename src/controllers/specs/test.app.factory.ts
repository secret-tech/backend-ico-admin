import { Response, Request, NextFunction } from 'express';

import {
  AuthClient,
  AuthClientType
} from '../../services/auth.client';

import * as express from 'express';
import * as TypeMoq from 'typemoq';
import { container } from '../../ioc.container';
import { InversifyExpressServer } from 'inversify-express-utils';
import * as bodyParser from 'body-parser';
import { Auth } from '../../middlewares/auth';
import handle from '../../middlewares/error.handler';

const mockAuthMiddleware = () => {
  const authMock = TypeMoq.Mock.ofType(AuthClient);

  const loginResult = {
    accessToken: 'new_token'
  };

  authMock.setup(x => x.loginTenant(TypeMoq.It.isAny(), TypeMoq.It.isAny()))
    .returns(async(): Promise<any> => loginResult);

  container.rebind<AuthClientInterface>(AuthClientType).toConstantValue(authMock.object);

  const auth = new Auth(container.get<AuthClientInterface>(AuthClientType));
  container.rebind<express.RequestHandler>('AuthMiddleware').toConstantValue(
    (req: any, res: any, next: any) => auth.authenticate(req, res, next)
  );
};

/* istanbul ignore next */
export const buildApp = () => {
  const newApp = express();
  newApp.use(bodyParser.json());
  newApp.use(bodyParser.urlencoded({ extended: false }));

  const server = new InversifyExpressServer(container, null, null, newApp);
  server.setErrorConfig((app) => {
    app.use((req: Request, res: Response, next: NextFunction) => {
      res.status(404).send({
        statusCode: 404,
        error: 'Route is not found'
      });
    });

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => handle(err, req, res, next));
  });

  return server.build();
};

export const testApp = () => {
  mockAuthMiddleware();

  return buildApp();
};
