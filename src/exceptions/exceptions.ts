export class ErrorWithFields extends Error {
  fields?: any;
  constructor(message?: string, fields?: any) {
    super(message);
    this.fields = fields;

    Object.setPrototypeOf(this, this.constructor.prototype);
  }
}
export class CustomError extends ErrorWithFields {}
