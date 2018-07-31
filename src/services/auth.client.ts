import * as request from 'web-request';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { Logger } from '../logger';

/* istanbul ignore next */
@injectable()
export class AuthClient implements AuthClientInterface {
  private logger = Logger.getInstance('AUTH_CLIENT');

  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;

    request.defaults({
      throwResponseError: true
    });
  }

  async loginTenant(email: string, password: string): Promise<AccessTokenResponse> {
    try {
      return await request.json<AccessTokenResponse>('/tenant/login', {
        baseUrl: this.baseUrl,
        method: 'POST',
        body: {
          email,
          password
        }
      });
    } catch (error) {
      this.logger.exception('loginTenant', error);
      throw error;
    }
  }

  async verifyTenantToken(token: string): Promise<TenantVerificationResult> {
    try {
      return (await request.json<TenantVerificationResponse>('/tenant/verify', {
        baseUrl: this.baseUrl,
        method: 'POST',
        body: {
          token
        }
      })).decoded;
    } catch (error) {
      this.logger.exception('verifyTenantToken', error);
      throw error;
    }
  }

  async logoutTenant(token: string): Promise<void> {
    try {
      await request.json<TenantVerificationResult>('/tenant/logout', {
        baseUrl: this.baseUrl,
        method: 'POST',
        body: {
          token
        }
      });
    } catch (error) {
      this.logger.exception('logoutTenant', error);
      throw error;
    }
  }

  async createUser(data: AuthUserData, tenantToken: string): Promise<UserRegistrationResult> {
    try {
      return await request.json<UserRegistrationResult>('/user', {
        baseUrl: this.baseUrl,
        method: 'POST',
        body: data,
        headers: {
          'authorization': `Bearer ${tenantToken}`,
          'accept': 'application/json',
          'content-type': 'application/json'
        }
      });
    } catch (error) {
      this.logger.exception('createUser', error);
      throw error;
    }
  }
}

const AuthClientType = Symbol('AuthClientInterface');
export { AuthClientType };
