import { Container } from 'inversify';
import { AuthClientType, AuthClient, AuthClientInterface } from './services/auth.client';
import { Auth } from './middlewares/auth';
import * as express from 'express';
import * as validation from './middlewares/request.validation';
import { InvestorService, InvestorServiceInterface, InvestorServiceType } from './services/investor.service';
import {
  TransactionService,
  TransactionServiceInterface,
  TransactionServiceType
} from './services/transaction.service';
import './controllers/investor.controller';
import './controllers/transaction.controller';
import {
  TransactionRepository,
  TransactionRepositoryInterface,
  TransactionRepositoryType
} from './services/repositories/transaction.repository';

let container = new Container();

// services
container.bind<AuthClientInterface>(AuthClientType).to(AuthClient);
container.bind<InvestorServiceInterface>(InvestorServiceType).to(InvestorService);
container.bind<TransactionServiceInterface>(TransactionServiceType).to(TransactionService);
container.bind<TransactionRepositoryInterface>(TransactionRepositoryType).to(TransactionRepository).inSingletonScope();


// middlewares
const auth = new Auth(container.get<AuthClientInterface>(AuthClientType));
/* istanbul ignore next */
container.bind<express.RequestHandler>('AuthMiddleware').toConstantValue(
  (req: any, res: any, next: any) => auth.authenticate(req, res, next)
);
container.bind<express.RequestHandler>('OnlyAcceptApplicationJson').toConstantValue(
  (req: any, res: any, next: any) => validation.onlyAcceptApplicationJson(req, res, next)
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
container.bind<express.RequestHandler>('TransactionGetListValidation').toConstantValue(
  (req: any, res: any, next: any) => validation.transactionGetListValidation(req, res, next)
);

export { container };
