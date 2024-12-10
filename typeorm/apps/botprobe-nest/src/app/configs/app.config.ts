import { registerAs } from '@nestjs/config';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { validateEnvs } from 'shared';
import { AppConfig } from '../app.type';

export default registerAs('appConfigs', (): AppConfig => {
  const validatedEnvs = validateEnvs(process.env, Environment);

  return validatedEnvs;
});

class Environment implements AppConfig {
  @IsOptional()
  @IsIn(['development', 'production', 'test'])
  NODE_ENV: 'development' | 'production' | 'test' = 'development';

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  PORT = 4000;

  @IsString()
  DATABASE_URL: string;
}
