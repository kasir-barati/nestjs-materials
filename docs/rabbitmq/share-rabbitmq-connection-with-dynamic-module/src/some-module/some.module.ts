import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './some-module.definition';
import { SomeService } from './some.service';

@Module({
  providers: [SomeService],
  exports: [SomeService],
})
export class SomeModule extends ConfigurableModuleClass {}
