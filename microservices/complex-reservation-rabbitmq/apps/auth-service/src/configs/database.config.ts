import { Inject, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import authServiceConfig from './auth-service.config';

export class DatabaseConfig implements MongooseOptionsFactory {
  private readonly logger = new Logger(DatabaseConfig.name);

  constructor(
    @Inject(authServiceConfig.KEY)
    private readonly authServiceConfigs: ConfigType<
      typeof authServiceConfig
    >,
  ) {}

  createMongooseOptions():
    | MongooseModuleOptions
    | Promise<MongooseModuleOptions> {
    const { MONGO_INITDB_DATABASE, DATABASE_URL } =
      this.authServiceConfigs;

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
