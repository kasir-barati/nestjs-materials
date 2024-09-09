import { Inject, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { connection, plugin } from 'mongoose';
import {
  transaction,
  TransactionConnection,
} from 'mongoose-transaction-decorator';
import appConfig from './app.config';

export class DatabaseConfig implements MongooseOptionsFactory {
  private readonly logger = new Logger(DatabaseConfig.name);

  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfigs: ConfigType<typeof appConfig>,
  ) {}

  createMongooseOptions():
    | MongooseModuleOptions
    | Promise<MongooseModuleOptions> {
    const { MONGO_INITDB_DATABASE, DATABASE_URL } = this.appConfigs;

    this.logger.log(
      `MongoDB connection string: ${DATABASE_URL}/${MONGO_INITDB_DATABASE}`,
    );

    plugin(transaction);
    new TransactionConnection().setConnection(connection);

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
