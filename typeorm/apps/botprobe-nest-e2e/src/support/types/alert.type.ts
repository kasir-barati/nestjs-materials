import { Response } from 'testing';

export type AlertBuilderResponse = Response<{
  createOneAlert: {
    id: string;
  };
}>;
