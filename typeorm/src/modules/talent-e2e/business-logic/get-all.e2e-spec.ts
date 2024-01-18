import { DefaultApi } from '../../../api-client';

describe('Talent e2e (/ GET)', () => {
    const defaultApi = new DefaultApi();

    it('should be able to return all the talents with their categories, and their reviews', async () => {
        const response = await defaultApi.talentControllerFindAll();

        expect(response.status).toBe(200);
    });
});
