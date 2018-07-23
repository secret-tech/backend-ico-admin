import { Request, Response, NextFunction } from 'express';
import { ErrorWithFields } from '../exceptions/exceptions';
import * as fs from 'fs';
import * as i18next from 'i18next';
import { responseErrorWithObject } from '../helpers/responses';

export default function handle(err: ErrorWithFields, req: Request, res: Response, next: NextFunction): void {
  let status;
  const lang = req.acceptsLanguages() || 'en';
  const langPath = __dirname + `/../resources/locales/${lang}/errors.json`;
  const translations = fs.existsSync(langPath) ? require(langPath) : null;

  i18next.init({
    lng: lang.toString(),
    resources: translations
  });

  switch (err.constructor) {
    default:
      status = 500;
      console.error(err.message);
      console.error(err.stack);
  }

  responseErrorWithObject(res, {
    'message': i18next.t(err.message, err.fields)
  }, status);
}
