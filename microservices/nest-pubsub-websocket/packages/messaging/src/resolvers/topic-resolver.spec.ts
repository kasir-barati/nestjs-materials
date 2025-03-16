import { TopicResolver } from './topic-resolver';

describe('TopicResolver', () => {
    it.each([
        ['customers', 'customers'],
        ['assets', 'assets'],
    ])(
        'resolve should return expected topic name',
        (topic: string, expected: string) => {
            const resolver = new TopicResolver(null);

            const result = resolver.resolve(topic);

            expect(result).toStrictEqual(expected);
        },
    );

    it.each([
        ['dev', 'customers', 'dev-customers'],
        ['pr-511', 'assets', 'pr-511-assets'],
    ])(
        'resolveWithDeployment should return expected topic name enhanced with deployment',
        (deployment: string, topic: string, expected: string) => {
            const resolver = new TopicResolver(deployment);

            const result = resolver.resolveWithDeployment(topic);

            expect(result).toStrictEqual(expected);
        },
    );

    it.each([
        ['customers', 'customers'],
        ['assets', 'assets'],
    ])(
        'resolveWithDeployment should fallback to topic name without enhanced deployment if no deployment is given',
        (topic: string, expected: string) => {
            const resolver = new TopicResolver(null);

            const result = resolver.resolveWithDeployment(topic);

            expect(result).toStrictEqual(expected);
        },
    );
});
