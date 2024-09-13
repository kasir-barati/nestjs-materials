import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Log extends AbstractDocument {
  @Prop({ type: String, required: true, index: true })
  requestId: string;

  @Prop({ type: [String] })
  tags?: string[];

  @Prop({ type: String })
  eventType: string;

  @Prop({ type: String })
  userId: string;

  @Prop({ type: Object })
  event: Record<string, unknown>;

  @Prop({ immutable: true })
  timestamp: Date;

  @Prop({ immutable: true })
  createdAt: Date;

  updatedAt: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
