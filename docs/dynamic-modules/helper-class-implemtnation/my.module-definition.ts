import {
  ConfigurableModuleBuilder,
  ConfigurableModuleOptionsFactory,
} from '@nestjs/common';

export interface ExtraMyModuleOptions {
  global?: boolean;
  myExtra: string;
}
export interface MyModuleOptions {
  someOption: number;
}
export type RegisterMyModuleOptions = MyModuleOptions & ExtraMyModuleOptions;

export const MODULE_EXTRAS_TOKEN = 'MODULE_EXTRAS_TOKEN';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<MyModuleOptions>()
  .setClassMethodName('register')
  .setExtras<ExtraMyModuleOptions>(
    { global: false, myExtra: '' },
    (definition, extras) => ({
      ...definition,
      global: extras.global,
    }),
  )
  .setFactoryMethodName('create')
  .build();
export type MyModuleOptionsFactory = ConfigurableModuleOptionsFactory<
  MyModuleOptions,
  'create'
>;
