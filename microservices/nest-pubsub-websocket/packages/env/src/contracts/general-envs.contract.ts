import { IsString } from 'class-validator';

export class GeneralEnv {
    @IsString()
    DEPLOYMENT: string;
}
