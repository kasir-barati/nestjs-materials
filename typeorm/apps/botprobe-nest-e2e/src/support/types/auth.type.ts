import { Response } from 'testing';

export type LoginResponse = Response<{
  login: {
    accessToken: string;
  };
}>;
