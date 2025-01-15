import { Client, createClient } from '../../__generated__';

describe('POST /graphql', () => {
  let client: Client;
  let clientWithJwt: Client;
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
              description: alertDescription,
              title: alertTitle,
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

  it.each([
    { title: { eq: alertTitle } },
    {
      or: [
        { title: { iLike: '%pipeline%' } },
        { description: { in: [alertDescription] } },
      ],
    },
  ])(
    'should return all the alarms when we filter with %o',
    async (filter) => {
      const {
        alerts: { edges: alerts },
      } = await clientWithJwt.query({
        alerts: {
          __args: {
            filter,
          },
          edges: {
            node: {
              title: true,
              alertType: {
                id: true,
                name: true,
              },
            },
          },
        },
      });

      expect(alerts).toPartiallyContain({
        node: {
          title: alertTitle,
          alertType: {
            id: '8f55cefb-402d-4615-9025-548f76362c27',
            name: 'leak-detection',
          },
        },
      });
    },
  );

  it('should return all the alarms when we filter based on id and userId', async () => {
    const userId = 'ed803422-42db-49c1-bc59-c2e9acdc3aa4';

    const {
      alerts: { edges: alerts },
    } = await clientWithJwt.query({
      alerts: {
        __args: {
          filter: {
            and: [
              { id: { eq: alertId } },
              { userId: { eq: userId } },
            ],
          },
        },
        edges: {
          node: {
            id: true,
            title: true,
            alertType: {
              id: true,
              name: true,
            },
          },
        },
      },
    });

    expect(alerts).toIncludeAllPartialMembers([
      {
        node: {
          id: alertId,
          title: alertTitle,
          alertType: {
            id: '8f55cefb-402d-4615-9025-548f76362c27',
            name: 'leak-detection',
          },
        },
      },
    ]);
  });
});
