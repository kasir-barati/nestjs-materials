import { DefaultApi } from '../../api-client';

describe('Talent e2e (Get all endpoint)', () => {
    const defaultApi = new DefaultApi();

    test('/ (GET)', async () => {
        const response = await defaultApi.talentControllerFindAll();

        expect(response.status).toBe(200);
    });
});
