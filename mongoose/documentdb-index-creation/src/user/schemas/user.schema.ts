import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { Address, AddressSchema } from '../../shared';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, autoCreate: true })
export class User {
  @Prop()
  email: string;

  @Prop({ type: AddressSchema })
  address: Address;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index(
  { email: 1 },
  { unique: true, name: 'userUniqueEmail' },
);
UserSchema.index({ 'address.city': 1 }, { name: 'userAddressCity' });
