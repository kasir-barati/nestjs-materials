import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AddressInformation } from './address-information.schema';
import { BankingInformation } from './backing-information.schema';
import { ContactInformation } from './contact-information.schema';
import { DriverLicense } from './driver-license.schema';
import { Vehicle } from './vehicle.schema';

@Schema({ timestamps: true })
export class Driver extends AbstractDocument {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  family: string;

  // MongoDB stores times in UTC by default, and will convert any local time representations into this form. Applications that must operate or report on some unmodified local time value may store the time zone alongside the UTC timestamp, and compute the original local time in their application logic.
  @Prop({ required: false })
  birthday?: Date;

  @Prop({ required: true })
  gender: string;

  @Prop()
  verificationId?: string;

  @Prop({ type: ContactInformation })
  contactInformation?: ContactInformation;

  @Prop({ type: AddressInformation })
  addressInformation?: AddressInformation;

  @Prop({ type: DriverLicense })
  driverLicense?: DriverLicense;

  @Prop({ type: Vehicle })
  vehicle?: Vehicle;

  @Prop({ type: BankingInformation })
  bankingInformation?: BankingInformation;

  createdAt: Date;
  updatedAt: Date;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);
