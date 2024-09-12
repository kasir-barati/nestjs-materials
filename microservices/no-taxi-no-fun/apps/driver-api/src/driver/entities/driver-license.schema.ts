import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class DriverLicense {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  issuerState: string;

  @Prop({ required: true })
  expirationDate: Date;

  @Prop({ required: true })
  classification: string;

  @Prop({ required: true })
  picture: string;
}
