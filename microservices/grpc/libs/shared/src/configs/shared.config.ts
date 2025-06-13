import { registerAs } from '@nestjs/config';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

import { NodeEnv, SharedConfig } from '../types/shared-config.type';
import { validateEnv } from '../utils/validate-env.util';

declare global {
   
  namespace NodeJS {
     
    interface ProcessEnv extends SharedConfig {}
  }
}

export default registerAs('sharedConfigs', (): SharedConfig => {
  const validatedEnvs = validateEnv(process.env, EnvironmentVariables);

  return validatedEnvs;
});

class EnvironmentVariables implements SharedConfig {
  @IsEnum(NodeEnv)
  @IsOptional()
  NODE_ENV: NodeEnv = NodeEnv.development;

  @IsInt()
  PORT: number;

  @IsString()
  SWAGGER_PATH: string;
}
