import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import databaseConfig from './database.config';
import { MongooseModuleConfig } from './mongoose-module.config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      useClass: MongooseModuleConfig,
    }),
  ],
  providers: [ConfigService],
})
export class DatabaseModule {}
