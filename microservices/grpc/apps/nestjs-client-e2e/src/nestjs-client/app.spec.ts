import { AppHealthCheckResponse } from '@grpc/shared';
import axios from 'axios';

describe('GET /api/health-check', () => {
  it('should return healthy message', async () => {
    const { status, data } = await axios.get(`/api/health-check`);

    expect(status).toBe(200);
    expect(data).toEqual({ message: 'healthy' } as AppHealthCheckResponse);
  });
});
