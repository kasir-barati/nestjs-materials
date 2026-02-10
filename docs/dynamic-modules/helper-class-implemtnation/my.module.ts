import { DynamicModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  ExtraMyModuleOptions,
  MODULE_EXTRAS_TOKEN,
  RegisterMyModuleOptions,
} from './my.module-definition';
import { MyService } from './my.service';

@Module({
  providers: [MyService],
  exports: [MyService],
})
export class MyModule extends ConfigurableModuleClass {
  private static extractExtras(
    options: RegisterMyModuleOptions | typeof ASYNC_OPTIONS_TYPE,
  ): ExtraMyModuleOptions {
    const { myExtra, global } = options;

    if (!myExtra) {
      throw new Error('myExtra is required in MyModule options');
    }

    return { myExtra, global };
  }

  static override register(options: RegisterMyModuleOptions): DynamicModule {
    const baseModule = super.register(options);
    const extraOptions = this.extractExtras(options);

    return {
      ...baseModule,
      imports: [
        ScheduleModule.forRoot(),
        /* ... */
      ],
      providers: [
        ...(baseModule.providers || []),
        {
          provide: MODULE_EXTRAS_TOKEN,
          useValue: extraOptions,
        },
      ],
    };
  }

  static override registerAsync(
    options: typeof ASYNC_OPTIONS_TYPE,
  ): DynamicModule {
    const baseModule = super.registerAsync(options);
    const extraOptions = this.extractExtras(options);

    return {
      ...baseModule,
      imports: [...(baseModule.imports || []), ScheduleModule.forRoot()],
      providers: [
        ...(baseModule.providers || []),
        {
          provide: MODULE_EXTRAS_TOKEN,
          useValue: extraOptions,
        },
      ],
    };
  }
}
