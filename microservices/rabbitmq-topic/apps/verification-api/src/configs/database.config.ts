import { NodeEnv } from '@app/common';
import { Inject, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import mongoose from 'mongoose';
import verificationApiConfig from './verification-api.config';

export class DatabaseConfig implements MongooseOptionsFactory {
  private readonly logger = new Logger(DatabaseConfig.name);

  constructor(
    @Inject(verificationApiConfig.KEY)
    private readonly driverApiConfigs: ConfigType<
      typeof verificationApiConfig
    >,
  ) {}

  createMongooseOptions():
    | MongooseModuleOptions
    | Promise<MongooseModuleOptions> {
    const { MONGO_INITDB_DATABASE, DATABASE_URL, NODE_ENV } =
      this.driverApiConfigs;

    if (NODE_ENV === NodeEnv.development) {
      this.logger.log(
        `MongoDB connection string: ${DATABASE_URL}/${MONGO_INITDB_DATABASE}`,
        'NestApplication',
      );

      mongoose.set('debug', true);
    }

    return {
      autoIndex: true,
      autoCreate: true,
      retryAttempts: 10,
      retryDelay: 30,
      uri: DATABASE_URL,
      dbName: MONGO_INITDB_DATABASE,
      replicaSet: 'rs0',
    };
  }
}
