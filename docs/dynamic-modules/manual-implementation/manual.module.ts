import { DynamicModule, Module, Provider } from '@nestjs/common';
import { WhateverModule } from 'whatever-3rd-party-package';

import { MODULE_OPTIONS_TOKEN } from './manual.constant';
import {
  ManualModuleAsyncOptions,
  ManualModuleOptions,
  ManualModuleOptionsFactory,
} from './manual.interface';
import { ManualService } from './manual.service';

@Module({})
export class ManualModule {
  static register(options: ManualModuleOptions): DynamicModule {
    return {
      module: ManualModule,
      global: options.global ?? false,
      imports: [WhateverModule.forRoot()/*, ... */],
      providers: [
        ManualService,
        { provide: MODULE_OPTIONS_TOKEN, useValue: options },
      ],
      exports: [ManualService],
    };
  }

  static registerAsync(options: ManualModuleAsyncOptions): DynamicModule {
    return {
      module: ManualModule,
      global: options.global ?? false,
      imports: [
        ...(Array.isArray(options.imports) ? options.imports : []),
        WhateverModule.forRoot(),
        /* ... */
      ],
      providers: [
        ManualService,
        ...this.createAsyncProviders(options),
      ],
      exports: [ManualService],
    };
  }

  private static createAsyncProviders(
    options: ManualModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass!,
        useClass: options.useClass!,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: ManualModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: MODULE_OPTIONS_TOKEN,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: MODULE_OPTIONS_TOKEN,
      useFactory: async (optionsFactory: ManualModuleOptionsFactory) =>
        await optionsFactory.create(),
      inject: [options.useExisting! || options.useClass],
    };
  }
}
