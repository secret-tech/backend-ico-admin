import { Response, Request, NextFunction } from 'express';
import * as fs from 'fs';
import * as i18next from 'i18next';
import { responseErrorWithObject } from '../helpers/responses';
import * as Joi from 'joi';
import * as HttpStatus from 'http-status';

const options = {
  allowUnknown: true,
  language: {}
};

const passwordRegex = /^[a-zA-Z0\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/;
const phoneNumberRegex = /^\+[1-9]\d{1,14}$/;
const ethereumAddressValidator = Joi.string().regex(/^0x[\da-fA-F]{40,40}$/);

export function onlyAcceptApplicationJson(req: Request, res: Response, next: NextFunction) {
  if (req.method !== 'OPTIONS' && req.header('Accept') !== 'application/json' && req.header('Content-Type') === 'application/json') {
    return res.status(406).json({
      error: 'Unsupported "Accept" header'
    });
  } else {
    return next();
  }
}

export function initiateLogin(req: Request, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  commonValidate(HttpStatus.UNPROCESSABLE_ENTITY, schema, req, res, next);
}

/* istanbul ignore next */
export function commonValidate(code: number, schema: Joi.Schema, req: Request, res: Response, next: NextFunction) {
  const lang = req.acceptsLanguages() || 'en';
  const langPath = __dirname + `/../resources/locales/${lang}/validation.json`;

  let data: any = {};

  if (fs.existsSync(langPath)) {
    options.language = require(langPath);
  }

  if (req.method.toLocaleLowerCase() === 'get') {
    data = req.query;
  } else {
    data = req.body;
  }

  const result = Joi.validate(data, schema, options);
  if (result.error) {
    responseErrorWithObject(res,{
      message: result.error.details[0].message
    }, code);
  } else {
    return next();
  }
}

/* istanbul ignore next */
export function paramsValidate(code: number, schema: Joi.Schema, req: Request, res: Response, next: NextFunction) {
  const lang = req.acceptsLanguages() || 'en';
  const langPath = __dirname + `/../resources/locales/${lang}/validation.json`;

  if (fs.existsSync(langPath)) {
    options.language = require(langPath);
  }

  const result = Joi.validate(req.params, schema, options);
  if (result.error) {
    responseErrorWithObject(res,{
      message: result.error.details[0].message
    }, code);
  } else {
    return next();
  }
}

export function investorIdValidation(req: Request, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    investorId: Joi.string().hex()
  });

  paramsValidate(HttpStatus.UNPROCESSABLE_ENTITY, schema, req, res, next);
}

export function updateInvestorValidation(req: Request, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    firstName: Joi.string().min(3).optional(),
    lastName: Joi.string().min(3).optional(),
    country: Joi.string().min(2).optional(),
    dob: Joi.string().isoDate().optional(),
    phone: Joi.string().optional().regex(phoneNumberRegex).options({
      language: {
        string: {
          regex: {
            base: translateCustomMessage('must be a valid phone number (+1234567890)', req)
          }
        }
      }
    }),
    newPassword: Joi.string().optional().regex(passwordRegex).options({
      language: {
        string: {
          regex: {
            base: translateCustomMessage('must be at least 8 characters, contain at least one number, 1 small and 1 capital letter', req)
          }
        }
      }
    }),
    kycStatus: Joi.string().valid(['verified', 'not_verified'])
  }).or(['firstName', 'lastName', 'country', 'dob', 'phone', 'newPassword', 'kycStatus']);

  commonValidate(HttpStatus.UNPROCESSABLE_ENTITY, schema, req, res, next);
}

export function accessUpdateMethodValidation(req: Request, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    method: Joi.string().valid(['activate', 'deactivate'])
  });

  paramsValidate(HttpStatus.METHOD_NOT_ALLOWED, schema, req, res, next);
}

/* istanbul ignore next */
export function translateCustomMessage(message: string, req: Request) {
  const lang = req.acceptsLanguages() || 'en';
  const langPath = __dirname + `/../resources/locales/${lang}/errors.json`;
  const translations = fs.existsSync(langPath) ? require(langPath) : null;

  i18next.init({
    lng: lang.toString(),
    resources: translations
  });

  return i18next.t(message);
}

export function transactionGetListValidation(req: Request, res: Response, next: NextFunction) {
  const schema = Joi.object().keys({
    type: Joi.string().valid(['ETH', 'TOKEN']).optional(),
    direction: Joi.string().valid(['IN', 'OUT']).optional(),
    walletAddress: ethereumAddressValidator.optional(),
    page: Joi.number().optional().default(0),
    limit: Joi.number().optional().default(50),
    sort: Joi.string().optional(),
    desc: Joi.boolean().optional()
  }).with('direction', 'walletAddress')
    .with('desc', 'sort');

  commonValidate(HttpStatus.UNPROCESSABLE_ENTITY, schema, req, res, next);
}
