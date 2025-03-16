import { Injectable } from '@nestjs/common';
import { ITopicResolver } from '../contracts/interfaces/topic-resolver.interface';

@Injectable()
export class TopicResolver implements ITopicResolver {
    constructor(private readonly deployment: string | null) {}

    resolve(topic: string): string {
        return topic;
    }

    /**
     *
     * @description To add the deployment string behind the topic
     */
    resolveWithDeployment(topic: string): string {
        if (this.deployment == null) {
            return topic;
        }

        return `${this.deployment}-${topic}`;
    }
}
