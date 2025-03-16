import { HealthController } from './health.controller';

describe('HealthController', () => {
    let controller: HealthController;

    beforeEach(() => {
        controller = new HealthController();
    });

    it('readHealth should return health status', () => {
        const result = controller.readHealth();

        expect(result).toStrictEqual({ success: true });
    });
});
