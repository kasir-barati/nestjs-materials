import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { PostTypeDiscriminator } from './post-type.schema';

@Schema({ _id: false })
export class NewsPost extends PostTypeDiscriminator {
  @Prop({ required: true })
  headlines: string[];
}

export const NewsPostSchema = SchemaFactory.createForClass(NewsPost);
