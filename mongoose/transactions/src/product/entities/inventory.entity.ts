import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from '../../database/abstract.schema';

@Schema({ timestamps: true })
export class Inventory extends AbstractDocument {
  @Prop({ required: true, type: Types.ObjectId })
  productId: Types.ObjectId | string;

  @Prop({ required: true })
  quantity: number;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
