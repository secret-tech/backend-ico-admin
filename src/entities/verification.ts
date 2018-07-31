import { Column } from 'typeorm';

export const AUTHENTICATOR_VERIFICATION = 'google_auth';
export const EMAIL_VERIFICATION = 'email';

export class Verification {
  @Column()
  id: string;

  @Column()
  method: string;

  @Column()
  attempts: number;

  @Column()
  expiredOn: number;
}
