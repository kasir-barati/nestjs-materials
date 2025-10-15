import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { PostStyleDiscriminator } from './post-style.schema';

@Schema({ _id: false })
export class FeaturedPost extends PostStyleDiscriminator {
  @Prop()
  poster: string;
}

export const FeaturedPostSchema =
  SchemaFactory.createForClass(FeaturedPost);
