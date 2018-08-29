import { controller, httpGet, httpPut } from 'inversify-express-utils';
import { inject } from 'inversify';
import { InvestorServiceInterface, InvestorServiceType } from '../services/investor.service';
import { Request, Response } from 'express';

@controller(
  '/investors',
  'OnlyAcceptApplicationJson',
  'AuthMiddleware'
)
export class InvestorController {
  constructor (
    @inject(InvestorServiceType) private investorService: InvestorServiceInterface
  ) {}

  @httpGet(
    '/'
  )
  async getList(req: Request, res: Response): Promise<void> {
    res.json(await this.investorService.getList());
  }

  @httpGet(
    '/:investorId',
    'InvestorIdValidation'
  )
  async getOne(req: Request, res: Response): Promise<void> {
    const { investorId } = req.params;

    res.json(await this.investorService.getOne(investorId));
  }

  @httpPut(
    '/:investorId',
    'InvestorIdValidation',
    'UpdateInvestorValidation'
  )
  async update(req: Request, res: Response): Promise<void> {
    const { investorId } = req.params;

    res.json(await this.investorService.update(investorId, req.body));
  }

  @httpGet(
    '/:investorId/:method',
    'InvestorIdValidation',
    'AccessUpdateMethodValidation'
  )
  async accessUpdate(req: Request, res: Response): Promise<void> {
    const { investorId, method } = req.params;

    res.json(await this.investorService.accessUpdate(investorId, method));
  }
}