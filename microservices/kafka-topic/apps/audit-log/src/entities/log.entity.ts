import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: { updatedAt: false } })
export class Log extends AbstractDocument {
  @Prop({ immutable: true })
  requestId: string;

  @Prop({ type: String, array: true, immutable: true })
  tags: string[];

  @Prop({ immutable: true })
  eventType: string;

  @Prop({ immutable: true })
  userId: string;

  @Prop({ type: Object, immutable: true })
  beforeEvent: Record<string, unknown> | undefined;

  @Prop({ type: Object, immutable: true })
  afterEvent: Record<string, unknown> | undefined;

  @Prop({ immutable: true })
  timestamp: Date;

  createdAt: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
