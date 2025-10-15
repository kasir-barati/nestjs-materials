import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { PostStyleDiscriminator } from './post-style.schema';

@Schema({ _id: false })
export class StandardPost extends PostStyleDiscriminator {
  @Prop()
  color: string;
}

export const StandardPostSchema =
  SchemaFactory.createForClass(StandardPost);
