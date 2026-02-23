import {
  ConfigurableModuleBuilder,
  ConfigurableModuleOptionsFactory,
} from '@nestjs/common';

export interface ExtraRedisModuleOptions {
  global?: boolean;
}
export interface RedisModuleOptions {
  redisUrl: string;
  redisPassword?: string;
}
export type RegisterRedisModuleOptions = RedisModuleOptions &
  ExtraRedisModuleOptions;
export const MODULE_EXTRAS_TOKEN = 'MODULE_EXTRAS_TOKEN';
export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<RedisModuleOptions>()
  .setClassMethodName('register')
  .setExtras<ExtraRedisModuleOptions>(
    { global: false },
    (definition, extras) => ({
      ...definition,
      global: extras.global,
    }),
  )
  .setFactoryMethodName('create')
  .build();
export type RedisModuleOptionsFactory = ConfigurableModuleOptionsFactory<
  RedisModuleOptions,
  'create'
>;
