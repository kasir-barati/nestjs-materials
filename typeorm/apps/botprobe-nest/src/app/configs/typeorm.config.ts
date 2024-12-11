import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import appConfig from './app.config';

export class TypeOrmConfig implements TypeOrmOptionsFactory {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfigs: ConfigType<typeof appConfig>,
  ) {}

  createTypeOrmOptions(
    connectionName?: string,
  ): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    const isNotProduction = this.appConfigs.NODE_ENV !== 'production';

    return {
      type: 'postgres',
      url: this.appConfigs.DATABASE_URL,
      entities: [],
      migrations: [],
      logging: isNotProduction,
      synchronize: isNotProduction,
      autoLoadEntities: isNotProduction,
    };
  }
}
