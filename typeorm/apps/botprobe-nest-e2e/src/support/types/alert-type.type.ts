import { Response } from 'testing';

export type AlertTypeBuilderResponse = Response<{
  createOneAlertType: {
    id: string;
  };
}>;
export type CreateAlertTypeResponse = Response<{
  createAlertType: {
    id: string;
    name: string;
    description: string;
  };
}>;
export type AlertTypesResponse = Response<{
  alertTypes: [
    {
      id: string;
      name: string;
      // Read this for more info:
      // https://github.com/kasir-barati/graphql-js-ts/blob/9d6aa2c980bb0f9365c25bd2dd06ff1aaeb1a331/docs/improve-dev-exp/filtering-using-prisma-nestjs-graphql.md#prismaNestjsGraphqlEvaluation
      // And this part is commented since it does not have pagination
      // Alerts: [
      //   {
      //     id: string;
      //     title: string;
      //   },
      // ];
      alertsConnection: {
        edges: {
          /**
           * @example eyJpZCI6ImZmZmVhMWVhLTQ3OGUtNDMyZS05YmM4LTQwM2I1NTljYzljZSJ9
           */
          cursor: string;
          node: {
            /**
             * @example 164d4152-290b-4cbc-817b-0d208485f51e
             */
            id: string;
            title: string;
          };
        }[];
        pageInfo: {
          /**
           * @example eyJpZCI6ImZmZmVhMWVhLTQ3OGUtNDMyZS05YmM4LTQwM2I1NTljYzljZSJ9
           */
          endCursor: string;
          startCursor: string;
          hasNextPage: boolean;
          hasPreviousPage: boolean;
        };
      };
    },
  ];
}>;
