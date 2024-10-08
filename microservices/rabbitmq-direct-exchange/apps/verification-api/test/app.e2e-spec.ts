import { isArray } from 'class-validator';
import { VerificationApi } from './api-client';

describe('Verification API (e2e)', () => {
  let verificationApi: VerificationApi;

  beforeAll(() => {
    verificationApi = new VerificationApi();
  });

  it('should read all verifications', async () => {
    const {
      data: { data, ...rest },
      status,
    } = await verificationApi.verificationControllerRead();

    expect(isArray(data)).toBeTruthy();
    expect(status).toBe(200);
    expect(rest).toStrictEqual(
      expect.objectContaining({
        page: expect.any(Number),
        limit: expect.any(Number),
        total: expect.any(Number),
        lastPage: expect.any(Number),
      }),
    );
    expect(rest.next).toBeOneOf([expect.any(Number), null]);
    expect(rest.prev).toBeOneOf([expect.any(Number), null]);
  });
});
