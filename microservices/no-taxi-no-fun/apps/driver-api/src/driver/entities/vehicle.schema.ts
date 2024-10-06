import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Vehicle {
  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  manufactureDate: Date;

  @Prop({ required: true })
  licensePlateNumber: string;

  @Prop({ required: true })
  vehicleIdentificationNumber: string;

  @Prop({ required: true })
  insuranceId: string;

  @Prop({ required: true })
  insuranceExpirationDate: Date;

  @Prop({ required: true })
  insurancePicture: string;
}
