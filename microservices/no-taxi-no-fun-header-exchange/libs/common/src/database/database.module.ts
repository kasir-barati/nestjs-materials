import { DynamicModule, Module } from '@nestjs/common';
import {
  ModelDefinition,
  MongooseModule,
  MongooseModuleAsyncOptions,
} from '@nestjs/mongoose';

@Module({})
export class DatabaseModule {
  static forFeature(models: ModelDefinition[]) {
    return MongooseModule.forFeature(models);
  }
  static forRootAsync(
    options: MongooseModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        ...options.imports,
        MongooseModule.forRootAsync(options),
      ],
    };
  }
}
