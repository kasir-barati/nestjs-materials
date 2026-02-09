import { ModuleMetadata, Type } from '@nestjs/common';

interface CommonOptionsForDynamicModules {
  global?: boolean;
}

export interface Options {
  someOption: number;
}
export type ManualModuleOptions = Options & CommonOptionsForDynamicModules;
export interface ManualModuleOptionsFactory {
  create(): Promise<Options> | Options;
}
export interface ManualModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'>, CommonOptionsForDynamicModules {
  useExisting?: Type<ManualModuleOptionsFactory>;
  useClass?: Type<ManualModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<Options> | Options;
  inject?: any[];
}
