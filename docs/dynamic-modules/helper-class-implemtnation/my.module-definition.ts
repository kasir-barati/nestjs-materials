import {
  ConfigurableModuleBuilder,
  ConfigurableModuleOptionsFactory,
} from '@nestjs/common';

export interface ExtraMyModuleOptions {
  global?: boolean;
}
export interface MyModuleOptions {
  someOption: number;
}
export type RegisterMyModuleOptions = MyModuleOptions &
  ExtraMyModuleOptions;

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, ASYNC_OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<MyModuleOptions>()
    .setClassMethodName('register')
    .setExtras<ExtraMyModuleOptions>(
      { global: false },
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
