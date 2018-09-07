declare interface RegistrationResult {
  id: string;
  email: string;
  login: string;
}

declare interface TenantRegistrationResult extends RegistrationResult {

}

declare interface UserRegistrationResult extends RegistrationResult {
  tenant: string;
  sub: string;
  scope?: any;
}

declare interface VerificationResult {
  id: string;
  login: string;
  jti: string;
  iat: number;
  aud: string;
}

declare interface TenantVerificationResult extends VerificationResult {
  isTenant: boolean;
}

declare interface UserVerificationResult extends VerificationResult {
  deviceId: string;
  sub: string;
  exp: number;
  scope?: any;
}

declare interface UserVerificationResponse {
  decoded: UserVerificationResult;
}

declare interface TenantVerificationResponse {
  decoded: TenantVerificationResult;
}

declare interface AuthUserData {
  email: string;
  login: string;
  password: string;
  sub: string;
  scope?: any;
}

declare interface UserLoginData {
  login: string;
  password: string;
  deviceId: string;
}

declare interface AccessTokenResponse {
  accessToken: string;
}

declare interface Result {
  status: number;
}

declare interface InitiateResult extends Result {
  verificationId: string;
  attempts: number;
  expiredOn: number;
  method: string;
  code?: string;
  totpUri?: string;
  qrPngDataUri?: string;
}

declare interface ValidationResult extends Result {
  data?: {
    verificationId: string;
    consumer: string;
    expiredOn: number;
    attempts: number;
    payload?: any;
  };
}

declare interface KycInitResult {
  timestamp: string;
}

declare interface InvestorResult {
  investorId?: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  country: string;
  dob: string;
  phone: string;
  ethAddress: string;
  kycStatus: string;
  amountDeposited: number;
  amountInvested: number;
}

declare interface InputInvestor {
  firstName?: string;
  lastName?: string;
  country?: string;
  dob?: string;
  phone?: string;
  newPassword?: string;
  kycStatus?: string;
}

declare interface AccessUpdateResult {
  consumer: string;
}

declare interface TransactionResult {
  id: string;
  transactionHash: string;
  status: string;
  type: string;
  amount: string;
  direction?: string;
  timestamp: number;
}

declare interface TransactionInputParams {
  type: string;
  direction: string;
  walletAddress: string;
}

declare interface PaginationParams {
  page: number;
  limit: number;
}

declare interface SortParams {
  sort: string;
  desc: boolean;
}

declare interface InvestorInputParams {
  country: string;
  kycStatus: string;
  search: string;
}