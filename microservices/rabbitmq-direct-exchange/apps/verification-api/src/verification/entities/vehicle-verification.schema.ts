import { Prop, Schema } from '@nestjs/mongoose';
import {
  InsuranceVerificationStatus,
  VehicleVerificationStatus,
} from '../../verification-api.type';

@Schema({ _id: false })
export class VehicleVerification {
  @Prop({
    type: String,
    required: true,
    enum: VehicleVerificationStatus,
  })
  status: VehicleVerificationStatus;

  @Prop({ required: false })
  inspectionDate?: Date;

  @Prop({ required: false })
  inspectionReport?: string;

  @Prop({
    type: String,
    required: true,
    enum: InsuranceVerificationStatus,
  })
  insuranceVerificationStatus: InsuranceVerificationStatus;
}
