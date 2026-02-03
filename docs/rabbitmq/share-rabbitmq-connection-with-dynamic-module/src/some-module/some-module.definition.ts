import { ConfigurableModuleBuilder } from '@nestjs/common';

export interface SomeModuleOptions {
  some: string;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<SomeModuleOptions>()
    .setClassMethodName('forRoot')
    .setExtras(
      {},
      (definition, extras: { global?: boolean }) => ({
        ...definition,
        global: extras.global ?? false,
        imports: [...(definition.imports || [])],
      })
    )
    .build();
