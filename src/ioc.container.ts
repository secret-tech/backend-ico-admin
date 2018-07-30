import { Container } from 'inversify';
import { AuthClientType, AuthClient } from './services/auth.client';
import { Auth } from './middlewares/auth';
import config from './config';
import * as express from 'express';
import * as validation from './middlewares/request.validation';
import { InvestorService, InvestorServiceInterface, InvestorServiceType } from './services/investor.service';
import './controllers/tenant.controller';
import './controllers/investor.controller';

let container = new Container();

// services

container.bind<AuthClientInterface>(AuthClientType).toConstantValue(new AuthClient(config.auth.baseUrl));
container.bind<InvestorServiceInterface>(InvestorServiceType).to(InvestorService).inSingletonScope();
// middlewares
const auth = new Auth(container.get<AuthClientInterface>(AuthClientType));
/* istanbul ignore next */
container.bind<express.RequestHandler>('AuthMiddleware').toConstantValue(
  (req: any, res: any, next: any) => auth.authenticate(req, res, next)
);
container.bind<express.RequestHandler>('OnlyAcceptApplicationJson').toConstantValue(
  (req: any, res: any, next: any) => validation.onlyAcceptApplicationJson(req, res, next)
);
container.bind<express.RequestHandler>('InitiateLoginValidation').toConstantValue(
  (req: any, res: any, next: any) => validation.initiateLogin(req, res, next)
);
container.bind<express.RequestHandler>('InvestorIdValidation').toConstantValue(
  (req: any, res: any, next: any) => validation.investorIdValidation(req, res, next)
);
/* istanbul ignore next */
container.bind<express.RequestHandler>('UpdateInvestorValidation').toConstantValue(
  (req: any, res: any, next: any) => validation.updateInvestorValidation(req, res, next)
);
container.bind<express.RequestHandler>('AccessUpdateMethodValidation').toConstantValue(
  (req: any, res: any, next: any) => validation.accessUpdateMethodValidation(req, res, next)
);

export { container };
