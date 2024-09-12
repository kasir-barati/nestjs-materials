import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class ContactInformation {
  @Prop({ required: true, index: true })
  phone: string;

  // Note that this uniqueness will be applied to the entire collection
  // Why sparse? https://stackoverflow.com/a/74411578/8784518
  @Prop({ required: true, unique: true, sparse: true })
  email: string;
}
