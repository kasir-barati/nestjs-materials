import { IsInt, IsMongoId, IsOptional } from 'class-validator';

class Retry {
  @IsOptional()
  @IsInt()
  retryCount?: number;
}

export class DriverVerificationRequestCompensatePayload extends Retry {
  @IsMongoId()
  driverId: string;
}

export class DriverVerificationRequestResponsePayload extends Retry {
  @IsMongoId()
  driverId: string;

  @IsMongoId()
  verificationId: string;
}

export class DriverVerificationRequestPayload {
  @IsMongoId()
  driverId: string;
}
