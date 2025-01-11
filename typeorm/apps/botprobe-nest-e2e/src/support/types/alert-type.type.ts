import { CursorConnectionType } from '@ptc-org/nestjs-query-graphql';
import { SharedAlert, SharedAlertType } from 'shared';
import { Response } from 'testing';

export type CreateOneAlertTypeResponse = Response<{
  createOneAlertType: {
    id: string;
    name: string;
    description: string;
  };
}>;
export type CreateOneAlertTypeBuilderResponse = Response<{
  createOneAlertType: { id: string };
}>;
export type AlertTypesResponse = Response<{
  alertTypes: CursorConnectionType<
    Omit<SharedAlertType, 'alerts'> & {
      alerts: CursorConnectionType<SharedAlert>;
    }
  >;
}>;
