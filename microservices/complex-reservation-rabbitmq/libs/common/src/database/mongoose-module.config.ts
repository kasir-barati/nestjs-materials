import { Inject, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import databaseConfig from './database.config';

export class MongooseModuleConfig implements MongooseOptionsFactory {
  private readonly logger = new Logger(MongooseModuleConfig.name);

  constructor(
    @Inject(databaseConfig.KEY)
    private readonly databaseConfigs: ConfigType<
      typeof databaseConfig
    >,
  ) {}

  createMongooseOptions():
    | MongooseModuleOptions
    | Promise<MongooseModuleOptions> {
    const { DATABASE_URL, MONGO_INITDB_DATABASE } =
      this.databaseConfigs;

    this.logger.log(
      `MongoDB connection string: ${DATABASE_URL}/${MONGO_INITDB_DATABASE}`,
      'NestApplication',
    );

    return {
      autoIndex: true,
      autoCreate: true,
      retryAttempts: 10,
      retryDelay: 30,
      uri: DATABASE_URL,
      dbName: MONGO_INITDB_DATABASE,
    };
  }
}
