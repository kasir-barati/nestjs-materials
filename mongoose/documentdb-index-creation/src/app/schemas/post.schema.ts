import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { PostCategory } from '../enums';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true, autoCreate: true })
export class Post {
  @Prop({
    type: String,
    required: true,
    index: true,
  })
  title: string;

  @Prop({
    type: [String],
    default: [],
    index: true,
  })
  tags: string[];

  @Prop({
    type: [String],
    default: [],
    enum: Object.values(PostCategory),
    index: true,
  })
  categories: PostCategory[];
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index(
  { title: 1, tags: 1 },
  { name: 'SearchByTitleAndTags' },
);
PostSchema.index(
  { title: 1, tags: 1, categories: 1 },
  { name: 'SearchByTitleAndTagsAndCategories' },
);
PostSchema.index(
  { title: 1, categories: 1 },
  { name: 'SearchByTitleAndCategories' },
);
PostSchema.index(
  { tags: 1, categories: 1 },
  { name: 'SearchByTagsAndCategories' },
);
