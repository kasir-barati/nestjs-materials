import { ConfigService } from '@nestjs/config';
import { GeneralEnv } from 'env';
import { TopicResolver } from '../resolvers/topic-resolver';

export async function getTopicResolver(
    configService: ConfigService<GeneralEnv>,
) {
    const deployment =
        configService.get<string>('DEPLOYMENT') ?? null;

    return new TopicResolver(deployment);
}
