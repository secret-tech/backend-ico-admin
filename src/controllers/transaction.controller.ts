import { controller, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TransactionServiceInterface, TransactionServiceType } from '../services/transaction.service';
import { Request, Response } from 'express';

@controller(
  '/transactions',
  'OnlyAcceptApplicationJson',
  'AuthMiddleware'
)
export class TransactionController {
  constructor(
    @inject(TransactionServiceType) private transactionService: TransactionServiceInterface
  ) {}

  @httpGet(
    '/',
    'TransactionGetListValidation'
  )
  async getList(req: Request, res: Response): Promise<void> {
    res.json(await this.transactionService.getList(req.query));
  }
}
