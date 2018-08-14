import * as request from 'web-request';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { Logger } from '../logger';
import config from '../config';

export interface AuthClientInterface {
  createUser(data: AuthUserData): Promise<UserRegistrationResult>;
  verifyUserToken(token: string): Promise<UserVerificationResult>;
}

/* istanbul ignore next */
@injectable()
export class AuthClient implements AuthClientInterface {
  private logger = Logger.getInstance('AUTH_CLIENT');

  tenantToken: string;
  baseUrl: string;

  constructor(baseUrl: string = config.auth.baseUrl) {
    this.tenantToken = config.auth.token;
    this.baseUrl = baseUrl;

    request.defaults({
      throwResponseError: true
    });
  }

  async createUser(data: AuthUserData): Promise<UserRegistrationResult> {
    try {
      return await request.json<UserRegistrationResult>('/user', {
        baseUrl: this.baseUrl,
        method: 'POST',
        body: data,
        headers: {
          'authorization': `Bearer ${this.tenantToken}`,
          'accept': 'application/json',
          'content-type': 'application/json'
        }
      });
    } catch (error) {
      this.logger.exception('createUser', error);
      throw error;
    }
  }

  async verifyUserToken(token: string): Promise<UserVerificationResult> {
    try {
      return (await request.json<UserVerificationResponse>('/auth/verify', {
        baseUrl: this.baseUrl,
        method: 'POST',
        headers: {
          'authorization': `Bearer ${this.tenantToken}`
        },
        body: { token }
      })).decoded;
    } catch (error) {
      this.logger.exception('verifyUserToken', error);
      throw error;
    }
  }
}

const AuthClientType = Symbol('AuthClientInterface');
export { AuthClientType };
