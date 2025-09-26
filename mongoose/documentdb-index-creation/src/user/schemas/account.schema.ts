import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { Address, AddressSchema } from '../../shared';

export type AccountDocument = HydratedDocument<Account>;

@Schema({ timestamps: true })
export class Account {
  @Prop({ type: [AddressSchema], default: [] })
  addresses: Address[];
}

export const AccountSchema = SchemaFactory.createForClass(Account);

AccountSchema.index(
  { 'addresses.city': 1 },
  { name: 'accountAddressUniqueCity' },
);
