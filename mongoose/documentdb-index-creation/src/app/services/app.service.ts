import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { randomString } from '../../shared';
import { PostCategory, PostStyle, PostType } from '../enums';
import { Post, PostDocument } from '../schemas';
import {
  isFeaturedPost,
  isNewsPost,
  isStandardPost,
  isTechPost,
} from '../types';

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
      style: {
        type: PostStyle.FEATURED,
        border: '1px solid #000',
        poster: 'https://example.com/poster.jpg',
      },
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
      style: {
        type: PostStyle.STANDARD,
        border: '1px dashed #ccc',
        color: 'blue',
      },
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
          if (post.style && isFeaturedPost(post.style)) {
            console.log(post.style.poster);
          }
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
          if (post.style && isStandardPost(post.style)) {
            console.log(post.style.color);
          }
          // type.techStack; // Property 'techStack' does not exist on type 'NewsPostMap'
          console.log('='.repeat(20));
        }
      }
    }

    return 'Hello World!';
  }
}
