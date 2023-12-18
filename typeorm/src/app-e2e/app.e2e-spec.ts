import { DefaultApi } from '../api-client';

describe('AppController (e2e)', () => {
    let defaultApi: DefaultApi = new DefaultApi();

    beforeEach(async () => {});

    it('/ (GET)', async () => {
        const response = await defaultApi.appControllerGetHello();

        expect(response.status).toBe(200);
        expect(response.data).toBe('Hello World!');
    });

    it('/health (GET)', async () => {
        const response = await defaultApi.appControllerGetHealth();

        expect(response.status).toBe(200);
        expect(response.data).toBeTruthy();
    });
});
