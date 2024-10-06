import { Prop, Schema } from '@nestjs/mongoose';
import { LicenseVerificationStatus } from '../../verification-api.type';

@Schema({ _id: false })
export class DrivingLicenseVerification {
  @Prop({
    type: String,
    required: true,
    enum: LicenseVerificationStatus,
  })
  status: LicenseVerificationStatus;

  @Prop({ required: true })
  provider: string;

  @Prop({ required: false })
  completedAt?: Date;
}
