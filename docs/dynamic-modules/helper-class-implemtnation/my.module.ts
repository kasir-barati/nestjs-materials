import { DynamicModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  RegisterMyModuleOptions
} from './my.module-definition';
import { MyService } from './my.service';

@Module({
  providers: [MyService],
  exports: [MyService],
})
export class MyModule extends ConfigurableModuleClass {
  static override register(
    options: RegisterMyModuleOptions,
  ): DynamicModule {
    const baseModule = super.register(options);

    return {
      ...baseModule,
      imports: [
        ScheduleModule.forRoot(),
        /* ... */
      ],
    };
  }

  static override registerAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    const baseModule = super.registerAsync(options);

    return {
      ...baseModule,
      imports: [
        ...(baseModule.imports || []),
        ScheduleModule.forRoot(),
      ],
    };
  }
}
