import { NodeEnv } from '@app/common';
import { Inject, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { set } from 'mongoose';
import auditLogConfig from './audit-log.config';

export class DatabaseConfig implements MongooseOptionsFactory {
  private readonly logger = new Logger(DatabaseConfig.name);

  constructor(
    @Inject(auditLogConfig.KEY)
    private readonly driverApiConfigs: ConfigType<
      typeof auditLogConfig
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

      set('debug', (collectionName, method, query, doc) => {
        this.logger.debug({
          collectionName,
          method,
          query,
          doc,
        });
      });
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
