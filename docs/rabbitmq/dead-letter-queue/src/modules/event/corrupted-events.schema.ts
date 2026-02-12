import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CorruptedEventDocument = HydratedDocument<CorruptedEvent>;

@Schema({ strict: false, timestamps: true })
export class CorruptedEvent {
  @Prop({ required: true })
  messageId: string;

  @Prop({ type: Object, required: true })
  rabbitmqHeaders: Record<string, any>;

  @Prop({ type: Object, required: true })
  rabbitmqMessage: Record<string, any>;
}

export const CorruptedEventSchema =
  SchemaFactory.createForClass(CorruptedEvent);

CorruptedEventSchema.index({ messageId: 1 }, { name: 'messageId_index' });
