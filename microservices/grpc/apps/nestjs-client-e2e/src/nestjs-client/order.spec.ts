import axios from 'axios';

describe('POST /api/orders/:id/processed', () => {
  it.each(['crap', '679e376285a815228da9ecf9', 123, true])(
    'should throw validation error on invalid ID',
    async (invalidId) => {
      const { status, data } = await axios.post(
        `/api/orders/${invalidId}/processed`,
        undefined,
        {
          validateStatus(status) {
            return true;
          },
        },
      );

      expect(status).toBe(400);
      expect(data).toEqual({
        error: 'Bad Request',
        message: ['id must be a UUID'],
        statusCode: 400,
      });
    },
  );

  it('should signals to the backend that order was processed', async () => {
    const id = 'c1ef64d0-d0f9-4f12-bf03-db4f1c3a26f7';

    const { status, data } = await axios.post(
      `/api/orders/${id}/processed`,
    );

    expect(status).toBe(200);
    expect(data).toBe('');
  });
});
