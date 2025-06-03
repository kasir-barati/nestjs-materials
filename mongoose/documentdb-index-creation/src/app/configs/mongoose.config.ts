import { Logger } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

export class MongooseConfig implements MongooseOptionsFactory {
  private readonly logger = new Logger(MongooseConfig.name);

  createMongooseOptions():
    | Promise<MongooseModuleOptions>
    | MongooseModuleOptions {
    return {
      uri: process.env.DB_URI,
      autoIndex: true,
      autoCreate: true,
    };
  }
}
