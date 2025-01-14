import axios from 'axios';
import { Client, createClient } from '../../__generated__';
import { SearchAlertResponse } from '../support/types/alert.type';

describe('POST /graphql', () => {
  let client: Client;
  let clientWithJwt: Client;
  const userId = 'fe7c9735-6bf4-42a1-b4b1-e5d9273518d8';
  let alertId: string;
  const alertTitle = 'leak alarm in the pipeline #4gh2oil';
  const alertDescription = 'Why pipeline 4gh2 i leaking oil again?';

  beforeAll(async () => {
    client = createClient();
    const {
      login: { accessToken },
    } = await client.query({
      login: { accessToken: true },
    });
    clientWithJwt = createClient({
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });
    const {
      createOneAlert: { id },
    } = await clientWithJwt.mutation({
      createOneAlert: {
        __args: {
          input: {
            alert: {
              alertTypeId: '8f55cefb-402d-4615-9025-548f76362c27',
              description: 'Some desc',
              title: 'Some title',
            },
          },
        },
        id: true,
      },
    });
    alertId = id;
  });

  it('should create a new alert', async () => {
    const title = 'Some random alert' + Math.random().toString();

    const { createOneAlert } = await clientWithJwt.mutation({
      createOneAlert: {
        __args: {
          input: {
            alert: {
              title,
              description: 'description',
              alertTypeId: '6faf44db-10bb-4a15-8e81-29b1beaee5c6',
            },
          },
        },
        title: true,
        alertType: {
          id: true,
          name: true,
        },
      },
    });

    expect(createOneAlert).toEqual({
      title,
      alertType: {
        id: '6faf44db-10bb-4a15-8e81-29b1beaee5c6',
        name: 'corrosion',
      },
    });
  });
});
