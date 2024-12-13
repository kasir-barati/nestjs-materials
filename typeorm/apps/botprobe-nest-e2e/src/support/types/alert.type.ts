import { Response } from 'testing';

export type AlertBuilderResponse = Response<{
  createOneAlert: {
    id: string;
  };
}>;
export type CreateAlertResponse = Response<{
  createAlert: {
    id: string;
    title: string;
    // Read this for more info:
    // https://github.com/kasir-barati/graphql-js-ts/blob/9d6aa2c980bb0f9365c25bd2dd06ff1aaeb1a331/docs/improve-dev-exp/filtering-using-prisma-nestjs-graphql.md#prismaNestjsGraphqlEvaluation
    AlertType: {
      id: string;
      name: string;
    };
  };
}>;
export type SearchAlertResponse = Response<{
  search: [
    {
      id: string;
      title: string;
      // Read this for more info:
      // https://github.com/kasir-barati/graphql-js-ts/blob/9d6aa2c980bb0f9365c25bd2dd06ff1aaeb1a331/docs/improve-dev-exp/filtering-using-prisma-nestjs-graphql.md#prismaNestjsGraphqlEvaluation
      AlertType: {
        id: string;
        name: string;
      };
    },
  ];
}>;
