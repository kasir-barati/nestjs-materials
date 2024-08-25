import { Inject, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import deadLetterNotificationServiceConfig from './dead-letter-notification-service.config';

export class DatabaseConfig implements MongooseOptionsFactory {
  private readonly logger = new Logger(DatabaseConfig.name);

  constructor(
    @Inject(deadLetterNotificationServiceConfig.KEY)
    private readonly deadLetterNotificationServiceConfigs: ConfigType<
      typeof deadLetterNotificationServiceConfig
    >,
  ) {}

  createMongooseOptions():
    | MongooseModuleOptions
    | Promise<MongooseModuleOptions> {
    const { MONGO_INITDB_DATABASE, DATABASE_URL } =
      this.deadLetterNotificationServiceConfigs;

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
