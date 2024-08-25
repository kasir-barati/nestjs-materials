import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class FailedEmail extends AbstractDocument {
  @Prop({
    required: false,
  })
  html?: string;

  @Prop({
    required: false,
  })
  text?: string;

  @Prop({
    required: true,
  })
  failedAfterRetryCount: number;

  @Prop({
    required: true,
  })
  to: string;

  createdAt: Date;
  updatedAt: Date;
}

export const FailedEmailSchema =
  SchemaFactory.createForClass(FailedEmail);
