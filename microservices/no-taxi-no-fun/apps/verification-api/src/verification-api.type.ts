import { NodeEnv } from '@app/common';

export interface VerificationApiConfig {
  VERIFICATION_API_PORT: number;
  SWAGGER_PATH: string;
  DATABASE_URL: string;
  MONGO_INITDB_DATABASE: string;
  RABBITMQ_URL: string;
  NODE_ENV: NodeEnv;
}
export enum BackgroundCheckStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
}
export enum IdentityVerificationStatus {
  failed = 'failed',
  pending = 'pending',
  verified = 'verified',
}
export enum LicenseVerificationStatus {
  failed = 'failed',
  pending = 'pending',
  verified = 'verified',
}
export enum VehicleVerificationStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
}
export enum InsuranceVerificationStatus {
  failed = 'failed',
  pending = 'pending',
  verified = 'verified',
}
