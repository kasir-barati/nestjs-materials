import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './schemas';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async onModuleInit() {
    // await this.userModel.create({
    //   email: 'jawad@barati.com',
    //   isVerified: true,
    //   address: { city: 'Forsaken Land' },
    // });
    // await this.userModel.create({
    //   email: 'kasir@barati.com',
    //   isVerified: false,
    //   address: { city: 'Never Winter' },
    // });
  }

  async users() {
    const users = await this.userModel.find().exec();

    return users.map((user) => user.toObject());
  }
}
