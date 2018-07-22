import { Response, Request, NextFunction } from 'express';
import * as fs from "fs";
import { responseErrorWithObject } from '../helpers/responses';
import * as Joi from 'joi';

const options = {
  allowUnknown: true,
  language: {}
};

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

  commonValidate(422, schema, req, res, next);
}

export function commonValidate(code: number, schema: Joi.Schema, req: Request, res: Response, next: NextFunction) {
  const lang = req.acceptsLanguages() || 'en';
  const langPath = __dirname + `/../resources/locales/${lang}/validation.json`;

  if (fs.existsSync(langPath)) {
    options.language = require(langPath);
  }

  const result = Joi.validate(req.body, schema, options);
  if (result.error) {
    responseErrorWithObject(res,{
      message: result.error.details[0].message
    }, code);
  } else {
    return next();
  }
}
