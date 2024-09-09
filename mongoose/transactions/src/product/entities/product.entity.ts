import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../database/abstract.schema';

@Schema({ timestamps: true })
export class Product extends AbstractDocument {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
