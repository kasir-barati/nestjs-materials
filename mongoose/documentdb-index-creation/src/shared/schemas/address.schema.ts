import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, timestamps: false })
export class Address {
  @Prop()
  city: string;
}
export const AddressSchema = SchemaFactory.createForClass(Address);
