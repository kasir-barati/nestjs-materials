import { Prop, Schema } from '@nestjs/mongoose';
import { BackgroundCheckStatus } from '../../verification-api.type';

@Schema({ _id: false })
export class BackgroundCheck {
  @Prop({
    type: String,
    required: true,
    enum: BackgroundCheckStatus,
  })
  status: BackgroundCheckStatus;

  @Prop({ required: true })
  provider: string;

  @Prop({
    required: true,
    type: [String],
  })
  attachments: string[];
}
