import { Filter } from '@ptc-org/nestjs-query-core';
import axios from 'axios';
import { SharedAlertType } from 'shared';
import { AlertTypesQueryBuilder } from '../support/builders/alert-type-query.builder';
import { AlertTypeBuilder } from '../support/builders/alert-type.builder';
import { AlertBuilder } from '../support/builders/alert.builder';
import {
  AlertTypesResponse,
  CreateOneAlertTypeResponse,
} from '../support/types/alert-type.type';
import { Auth } from '../support/utils/auth.util';

describe('POST /graphql', () => {
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
