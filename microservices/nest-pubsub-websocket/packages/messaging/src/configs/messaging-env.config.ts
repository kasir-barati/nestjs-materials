import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import { validateEnvs } from 'env';

export default registerAs('messagingEnvConfig', () => {
    return validateEnvs(process.env, MessagingEnv);
});

export class MessagingEnv {
    @IsString()
    MESSAGING_BROKER: string;
    @IsString()
    MESSAGING_USERNAME: string;
    @IsString()
    MESSAGING_PASSWORD: string;
}
