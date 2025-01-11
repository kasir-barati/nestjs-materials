import { Filter } from '@ptc-org/nestjs-query-core';
import {
  CursorPagingType,
  PageInfoType,
} from '@ptc-org/nestjs-query-graphql';
import { SharedAlert, SharedAlertType } from 'shared';

export class AlertTypesQueryBuilder {
  private fields = '';
  private variables: Record<string, any> = {};
  private alertsFields = '';
  private alertsPageInfo = '';

  setFilters(filter: Filter<SharedAlertType>) {
    this.variables = { ...this.variables, filter };

    return this;
  }

  setAlertsPaging(
    paging: Omit<CursorPagingType, 'offset' | 'limit'>,
  ) {
    this.variables = { ...this.variables, alertsPaging: paging };

    return this;
  }

  setFields(fields: Array<keyof SharedAlertType>) {
    this.fields = fields.join(' ');

    return this;
  }

  setAlertsFields(fields: Array<keyof SharedAlert>) {
    this.alertsFields = fields.join(' ');

    return this;
  }

  setAlertsPageInfo(pageInfo: Array<keyof PageInfoType>) {
    this.alertsPageInfo = pageInfo.join(' ');

    return this;
  }

  build() {
    const query = `#graphql
      query(
        $filter: AlertTypeFilter!,
        $alertsPaging: CursorPaging!
      ) {
        alertTypes(filter: $filter) {
          edges {
            node {
              ${this.fields}
              alerts(
                paging: $alertsPaging
              ) {
                edges {
                  cursor
                  node {
                    ${this.alertsFields}
                  }
                }
                pageInfo {
                  ${this.alertsPageInfo}
                }
              }
            }
          }
        }
      }
    `;

    return {
      query,
      variables: this.variables,
    };
  }
}
