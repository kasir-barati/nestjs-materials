import { AsyncModelFactory } from '@nestjs/mongoose';

import { Post, PostSchema, User, UserSchema } from './schemas';

export const schemaFactories: AsyncModelFactory[] = [
  { name: User.name, useFactory: () => UserSchema },
  { name: Post.name, useFactory: () => PostSchema },
];
