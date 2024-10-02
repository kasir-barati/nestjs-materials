import { registerAs } from '@nestjs/config';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { NodeEnv } from '../types/node-env.type';
import { validateEnv } from '../utils/validate-env.util';
import { MessagingConfig } from './types/messaging.type';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends MessagingConfig {}
  }
}

export default registerAs('messagingConfigs', (): MessagingConfig => {
  const validatedEnvs = validateEnv(
    process.env,
    EnvironmentVariables,
  );

  return validatedEnvs;
});

class EnvironmentVariables implements MessagingConfig {
  @IsEnum(NodeEnv)
  @IsOptional()
  NODE_ENV: NodeEnv = NodeEnv.development;

  @IsString()
  @IsOptional()
  MESSAGING_BROKER: string = 'kafka:9092';

  @IsString()
  @IsOptional()
  MESSAGING_USERNAME: string = 'admin';

  @IsString()
  @IsOptional()
  MESSAGING_PASSWORD: string = 'password';
}
