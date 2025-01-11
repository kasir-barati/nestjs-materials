import axios from 'axios';
import { AlertTypesQueryBuilder } from '../support/builders/alert-type-query.builder';
import { AlertTypeBuilder } from '../support/builders/alert-type.builder';
import { AlertBuilder } from '../support/builders/alert.builder';
import {
  AlertTypesResponse,
  CreateAlertTypeResponse,
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
});
