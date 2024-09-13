import { Prop, Schema } from '@nestjs/mongoose';
import { IdentityVerificationStatus } from '../../verification-api.type';

@Schema({ timestamps: true })
export class IdentityVerification {
  @Prop({ required: true })
  documentType: string;

  @Prop({ required: true })
  documentNumber: string;

  @Prop({ required: true })
  documentPicture: string;

  @Prop({
    type: String,
    required: true,
    enum: IdentityVerificationStatus,
  })
  status: IdentityVerificationStatus;

  // MongoDB stores times in UTC by default, and will convert any local time representations into this form. Applications that must operate or report on some unmodified local time value may store the time zone alongside the UTC timestamp, and compute the original local time in their application logic.
  @Prop({ required: false })
  completedAt?: Date;
}
