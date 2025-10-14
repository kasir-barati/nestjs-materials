import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { PostTypeDiscriminator } from './post-type.schema';

@Schema({ _id: false })
export class TechPost extends PostTypeDiscriminator {
  @Prop({ required: true })
  techStack: string[];
}

export const TechPostSchema = SchemaFactory.createForClass(TechPost);
