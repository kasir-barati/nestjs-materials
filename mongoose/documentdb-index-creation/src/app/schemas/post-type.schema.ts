import { Schema } from '@nestjs/mongoose';

import { PostType } from '../enums';

@Schema({ _id: false, discriminatorKey: 'type' })
export class PostTypeDiscriminator {
  // The 'type' field is automatically managed by Mongoose discriminators
  // Do not define it with @Prop decorator
  type: PostType;
}
