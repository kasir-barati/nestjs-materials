import { Prop, Schema } from '@nestjs/mongoose';

import { PostStyle } from '../enums';

@Schema({ _id: false, discriminatorKey: 'type' })
export class PostStyleDiscriminator {
  // The 'style' field is automatically managed by Mongoose discriminators
  // Do not define it with @Prop decorator
  type: PostStyle;

  @Prop()
  border: string;
}
