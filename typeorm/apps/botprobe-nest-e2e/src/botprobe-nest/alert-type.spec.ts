import { Filter } from '@ptc-org/nestjs-query-core';
import axios from 'axios';
import { SharedAlertType } from 'shared';
import { Client, createClient } from '../../__generated__';
import { AlertTypesQueryBuilder } from '../support/builders/alert-type-query.builder';
import { AlertTypeBuilder } from '../support/builders/alert-type.builder';
import { AlertBuilder } from '../support/builders/alert.builder';
import { AlertTypesResponse } from '../support/types/alert-type.type';

describe('POST /graphql', () => {
  let client: Client;

  beforeAll(() => {
    client = createClient();
  });

  it('should return all the alarm types with the "leak" inside their name', async () => {
    const alertTypesQueryBuilder = new AlertTypesQueryBuilder();
    const { query, variables } = alertTypesQueryBuilder
      .setFields(['id', 'name'])
      .setAlertsFields(['id', 'title'])
      .setAlertsPageInfo(['endCursor', 'hasNextPage'])
      .setFilters({ name: { iLike: '%leak%' } })
      .setAlertsPaging({ first: 3 })
      .build();

    const { status, data } = await axios.post<AlertTypesResponse>(
      `/graphql`,
      { query, variables },
    );

    expect(status).toBe(200);
    expect(data).toStrictEqual({
      data: {
        alertTypes: {
          edges: [
            {
              node: {
                id: expect.any(String),
                name: 'leak-detection',
                alerts: {
                  edges: expect.arrayContaining([
                    {
                      cursor: expect.any(String),
                      node: {
                        id: expect.any(String),
                        title: expect.any(String),
                      },
                    },
                  ]),
                  pageInfo: expect.objectContaining({
                    endCursor: expect.any(String),
                    hasNextPage: true,
                  }),
                },
              },
            },
          ],
        },
      },
    });
  });

  it('should return the alarm type & paginate through its alerts forward', async () => {
    // Arrange
    const alertTypeId = await new AlertTypeBuilder().build();
    const firstAlertId = await new AlertBuilder()
      .setAlertTypeId(alertTypeId)
      .build();
    const secondAlertId = await new AlertBuilder()
      .setAlertTypeId(alertTypeId)
      .build();
    const thirdAlertId = await new AlertBuilder()
      .setAlertTypeId(alertTypeId)
      .build();
    const forthAlertId = await new AlertBuilder()
      .setAlertTypeId(alertTypeId)
      .build();
    const fifthAlertId = await new AlertBuilder()
      .setAlertTypeId(alertTypeId)
      .build();
    const filter = { id: { eq: alertTypeId } };
    const first = 2;

    // Act
    const { alertsIds, lastAlertCursor } = await queryAlertTypes(
      filter,
      first,
    );

    // Assert
    expect(alertsIds).toStrictEqual([firstAlertId, secondAlertId]);

    // Arrange
    const { query, variables } = new AlertTypesQueryBuilder()
      .setFields(['id', 'name'])
      .setFilters(filter)
      .setAlertsFields(['id', 'title'])
      .setAlertsPaging({ first, after: lastAlertCursor })
      .setAlertsPageInfo([
        'endCursor',
        'hasNextPage',
        'startCursor',
        'hasPreviousPage',
      ])
      .build();

    // Act
    const {
      data: {
        data: {
          alertTypes: { edges: alertTypes },
        },
      },
    } = await axios.post<AlertTypesResponse>(`/graphql`, {
      query,
      variables,
    });
    const {
      node: { alerts },
    } = alertTypes[0];
    const paginatedAlertsIds = alerts.edges.map(
      (edge) => edge.node.id,
    );

    // Assert
    expect(paginatedAlertsIds).toStrictEqual([
      thirdAlertId,
      forthAlertId,
    ]);
    expect(alerts.pageInfo.hasNextPage).toBeTrue();
    expect(alerts.pageInfo.hasPreviousPage).toBeTrue();
    expect(alerts.pageInfo.endCursor).toBeString();
    expect(alerts.pageInfo.startCursor).toBeString();
  });

  it('should return the alarm type & paginate through its alerts backward', async () => {
    // Arrange
    const alertTypeId = await new AlertTypeBuilder().build();
    const firstAlertId = await new AlertBuilder()
      .setAlertTypeId(alertTypeId)
      .build();
    const secondAlertId = await new AlertBuilder()
      .setAlertTypeId(alertTypeId)
      .build();
    const thirdAlertId = await new AlertBuilder()
      .setAlertTypeId(alertTypeId)
      .build();
    const forthAlertId = await new AlertBuilder()
      .setAlertTypeId(alertTypeId)
      .build();
    const fifthAlertId = await new AlertBuilder()
      .setAlertTypeId(alertTypeId)
      .build();
    const filter = { id: { eq: alertTypeId } };
    const last = 2;
    const firstTenAlertOfAlertType = await client.query({
      alertTypes: {
        __args: { filter },
        edges: {
          node: {
            alerts: {
              __args: {
                paging: { first: 10 },
              },
              edges: {
                cursor: true,
              },
            },
          },
        },
      },
    });
    const firstTenAlerts =
      firstTenAlertOfAlertType.alertTypes.edges[0].node.alerts.edges;
    const lastItemInFirstTenAlertCursor =
      firstTenAlerts[firstTenAlerts.length - 1].cursor;

    // Act
    const data = await client.query({
      alertTypes: {
        __args: { filter },
        edges: {
          cursor: true,
          node: {
            id: true,
            name: true,
            alerts: {
              __args: {
                paging: {
                  last,
                  before: lastItemInFirstTenAlertCursor,
                },
              },
              edges: {
                cursor: true,
                node: {
                  id: true,
                  title: true,
                },
              },
              pageInfo: {
                endCursor: true,
                hasNextPage: true,
                startCursor: true,
                hasPreviousPage: true,
              },
            },
          },
        },
      },
    });

    // Assert
    expect(
      data.alertTypes.edges[0].node.alerts.edges.map(
        (edge) => edge.node.id,
      ),
    ).toStrictEqual([thirdAlertId, forthAlertId]);

    // Arrange
    const before =
      data.alertTypes.edges[0].node.alerts.edges[0].cursor;

    // Act
    const {
      alertTypes: { edges: alertTypes },
    } = await client.query({
      alertTypes: {
        __args: { filter },
        edges: {
          node: {
            id: true,
            name: true,
            alerts: {
              __args: { paging: { last, before } },
              edges: {
                cursor: true,
                node: {
                  id: true,
                  title: true,
                },
              },
              pageInfo: {
                endCursor: true,
                hasNextPage: true,
                startCursor: true,
                hasPreviousPage: true,
              },
            },
          },
        },
      },
    });

    // Assert
    expect(
      alertTypes[0].node.alerts.edges.map((edge) => edge.node.id),
    ).toStrictEqual([firstAlertId, secondAlertId]);
    expect(alertTypes[0].node.alerts.pageInfo.hasNextPage).toBeTrue();
    expect(
      alertTypes[0].node.alerts.pageInfo.hasPreviousPage,
    ).toBeFalse();
    expect(alertTypes[0].node.alerts.pageInfo.endCursor).toBeString();
    expect(
      alertTypes[0].node.alerts.pageInfo.startCursor,
    ).toBeString();
  });

  it('should create an alarm type', async () => {
    const {
      createOneAlertType: { name, description },
    } = await client.mutation({
      createOneAlertType: {
        __args: {
          input: {
            alertType: {
              name: 'Random-Pandora-Axe',
              description: 'Described alert type',
            },
          },
        },
        name: true,
        description: true,
      },
    });

    expect(name).toBe('Random-Pandora-Axe');
    expect(description).toBe('Described alert type');
  });
});

async function queryAlertTypes(
  filter: Filter<SharedAlertType>,
  first: number,
) {
  const { query: query1, variables: variables1 } =
    new AlertTypesQueryBuilder()
      .setFields(['id', 'name'])
      .setAlertsFields(['id', 'title'])
      .setFilters(filter)
      .setAlertsPaging({ first })
      .setAlertsPageInfo([
        'endCursor',
        'hasNextPage',
        'startCursor',
        'hasPreviousPage',
      ])
      .build();
  const {
    data: {
      data: {
        alertTypes: { edges: alertTypes },
      },
    },
  } = await axios.post<AlertTypesResponse>(`/graphql`, {
    query: query1,
    variables: variables1,
  });
  const {
    node: {
      alerts: { edges: alerts },
    },
  } = alertTypes[0];

  const alertsIds = alerts.map((connection) => connection.node.id);
  const lastAlertCursor = alerts[alerts.length - 1].cursor;

  return { lastAlertCursor, alertsIds };
}
