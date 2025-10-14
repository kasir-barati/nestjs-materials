import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { PostCategory, PostType } from '../enums';
import { PostTypeUnion } from '../types';
import { NewsPostSchema } from './news-post.schema';
import { PostTypeDiscriminator } from './post-type.schema';
import { TechPostSchema } from './tech-post.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true, autoCreate: true })
export class Post {
  @Prop({
    type: String,
    required: true,
  })
  title: string;

  @Prop({
    type: [String],
    default: [],
  })
  tags: string[];

  @Prop({
    type: [String],
    default: [],
    enum: Object.values(PostCategory),
  })
  categories: PostCategory[];

  @Prop({
    type: [PostTypeDiscriminator],
    required: true,
  })
  type: PostTypeUnion[];
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.path('type').schema.discriminator(
  PostType.NEWS,
  NewsPostSchema,
);
PostSchema.path('type').schema.discriminator(
  PostType.TECH,
  TechPostSchema,
);
PostSchema.index({ title: 1 }, { name: 'findPostsByTitle' });
PostSchema.index({ tags: 1 }, { name: 'findPostsByTags' });
PostSchema.index(
  { categories: 1 },
  { name: 'findPostsByCategories' },
);
PostSchema.index(
  { title: 1, tags: 1 },
  { name: 'SearchByTitleAndTags', background: false },
);
PostSchema.index(
  { title: 1, categories: 1 },
  { name: 'SearchByTitleAndCategories', background: false },
);
