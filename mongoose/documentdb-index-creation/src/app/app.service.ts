import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { randomString } from '../shared';
import { PostCategory } from './enums';
import { Post, PostDocument, User, UserDocument } from './schemas';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
  ) {}

  async getHello() {
    await this.userModel.create({
      email: randomString(13) + '@byd.com',
    });
    await this.postModel.create({
      title: randomString(53),
      tags: ['tdd', 'database', 'mongoose', 'DocumentDB', 'index'],
      categories: [
        PostCategory.SOFTWARE_DEVELOPMENT,
        PostCategory.TUTORIAL,
      ],
    });

    return 'Hello World!';
  }
}
