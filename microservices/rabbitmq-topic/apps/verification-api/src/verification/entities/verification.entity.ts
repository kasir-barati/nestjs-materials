import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BackgroundCheck } from './background-check.schema';
import { DrivingLicenseVerification } from './driving-license.schema';
import { IdentityVerification } from './indentity-verification.schema';
import { VehicleVerification } from './vehicle-verification.schema';

@Schema({ timestamps: true })
export class Verification extends AbstractDocument {
  @Prop({ type: Types.ObjectId, required: true, immutable: true })
  driverId: Types.ObjectId | string;

  @Prop({
    required: false,
    type: BackgroundCheck,
  })
  backgroundCheck?: BackgroundCheck;

  @Prop({
    required: false,
    type: IdentityVerification,
  })
  identityVerification?: IdentityVerification;

  @Prop({
    required: false,
    type: DrivingLicenseVerification,
  })
  drivingLicenseVerification?: DrivingLicenseVerification;

  @Prop({
    required: false,
    type: VehicleVerification,
  })
  vehicleVerification?: VehicleVerification;

  @Prop({ required: false })
  notes?: string;
}

export const VerificationSchema =
  SchemaFactory.createForClass(Verification);
