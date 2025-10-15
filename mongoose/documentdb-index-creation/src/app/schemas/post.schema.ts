import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { PostCategory, PostStyle, PostType } from '../enums';
import { PostStyleUnion, PostTypeUnion } from '../types';
import { FeaturedPostSchema } from './featured-post.schema';
import { NewsPostSchema } from './news-post.schema';
import { PostStyleDiscriminator } from './post-style.schema';
import { PostTypeDiscriminator } from './post-type.schema';
import { StandardPostSchema } from './standard-post.schema';
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

  @Prop({
    type: PostStyleDiscriminator,
  })
  style?: PostStyleUnion;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.path('style').schema.discriminator(
  PostStyle.STANDARD,
  StandardPostSchema,
);
PostSchema.path('style').schema.discriminator(
  PostStyle.FEATURED,
  FeaturedPostSchema,
);
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
