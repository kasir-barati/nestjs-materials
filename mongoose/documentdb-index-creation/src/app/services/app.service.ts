import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { randomString } from '../../shared';
import { PostCategory, PostType } from '../enums';
import { Post, PostDocument } from '../schemas';
import { isNewsPost, isTechPost } from '../types';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
  ) {}

  async getHello() {
    await this.postModel.create({
      title: randomString(53),
      tags: ['tdd', 'database', 'mongoose', 'DocumentDB', 'index'],
      categories: [
        PostCategory.SOFTWARE_DEVELOPMENT,
        PostCategory.TUTORIAL,
      ],
      type: [
        {
          type: PostType.TECH,
          techStack: ['Node.js', 'TypeScript', 'MongoDB'],
        },
      ],
    });

    await this.postModel.create({
      title: randomString(53),
      tags: ['news', 'updates'],
      categories: [PostCategory.SOFTWARE_DEVELOPMENT],
      type: [
        {
          type: PostType.NEWS,
          headlines: ['Breaking News', 'Latest Updates'],
        },
      ],
    });

    const posts = await this.postModel.find();

    for (const post of posts) {
      for (const type of post.type) {
        if (isTechPost(type)) {
          console.log('='.repeat(20));
          console.log('Tech post: ');
          console.log(post.tags);
          console.log(post.title);
          console.log(type.techStack);
          console.log(post.categories);
          // type.headlines; // Property 'headlines' does not exist on type 'TechPostMap'
          console.log('='.repeat(20));
        }
        if (isNewsPost(type)) {
          console.log('='.repeat(20));
          console.log('News post: ');
          console.log(post.tags);
          console.log(post.title);
          console.log(type.headlines);
          console.log(post.categories);
          // type.techStack; // Property 'techStack' does not exist on type 'NewsPostMap'
          console.log('='.repeat(20));
        }
      }
    }

    return 'Hello World!';
  }
}
