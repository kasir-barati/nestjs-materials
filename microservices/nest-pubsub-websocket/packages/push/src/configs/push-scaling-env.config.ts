import { registerAs } from '@nestjs/config';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { validateEnvs } from 'backend/libs/env/validate-envs';

export default registerAs('pushScalingEnvConfig', () => {
    return validateEnvs(process.env, PushScalingEnv);
});

export class PushScalingEnv {
    @IsString()
    REDIS_HOST: string;

    @Type(() => Number)
    @IsNumber()
    REDIS_PORT: number;

    @IsString()
    REDIS_USERNAME: string;

    @IsString()
    REDIS_PASSWORD: string;
}
