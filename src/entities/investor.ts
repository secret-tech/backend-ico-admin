import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { Index } from 'typeorm/decorator/Index';
import { Verification } from './verification';
import { Wallet } from './wallet';
import { Invitee } from './invitee';


export const KYC_STATUS_NOT_VERIFIED = 'not_verified';
export const KYC_STATUS_VERIFIED = 'verified';
export const KYC_STATUS_FAILED = 'failed';
export const KYC_STATUS_PENDING = 'pending';

@Entity()
@Index('email', () => ({ email: 1 }), { unique: true })
export class Investor implements Object {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @Column()
  country: string;

  @Column()
  dob: string;

  @Column()
  passwordHash: string;

  @Column()
  agreeTos: boolean;

  @Column()
  isVerified: boolean;

  @Column()
  defaultVerificationMethod: string;

  @Column()
  referralCode: string;

  @Column()
  referral: string;

  @Column()
  kycStatus: string;

  @Column()
  source: any;

  @Column(type => Verification)
  verification: Verification;

  @Column(type => Wallet)
  ethWallet: Wallet;

  @Column(type => Invitee)
  invitees: Invitee[];

  @Column()
  kycInitResult: KycInitResult;

  get name() {
    return `${this.firstName} ${this.lastName}`;
  }
}
