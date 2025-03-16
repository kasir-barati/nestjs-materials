export abstract class ITopicResolver {
    abstract resolve(topic: string): string;

    abstract resolveWithDeployment(topic: string): string;
}
