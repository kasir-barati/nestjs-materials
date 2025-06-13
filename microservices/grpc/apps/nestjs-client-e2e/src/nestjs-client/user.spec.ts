import {
  credentials,
  loadPackageDefinition,
  Metadata,
} from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { join } from 'path';

import {
  GrpcUserServiceClient,
  User,
} from '../../../nestjs-client/src/assets/interfaces/user.interface';
import { GrpcErrorResponse } from '../support/shared.type';
import {
  FindOneResolveType,
  LoadPackageDefinition,
} from '../support/user-grpc.type';

describe('User gRPC procedures', () => {
  let client: GrpcUserServiceClient;

  beforeAll(() => {
    const PROTO_PATH = join(
      __dirname,
      '..',
      '..',
      '..',
      'nestjs-client',
      'src',
      'assets',
      'user.proto',
    );
    const packageDefinition = loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });
    const {
      user: { GrpcUserService },
    } = loadPackageDefinition(
      packageDefinition,
    ) as unknown as LoadPackageDefinition;
    const SERVER_ADDRESS = 'localhost:3000';
    client = new GrpcUserService(
      SERVER_ADDRESS,
      credentials.createInsecure(),
    );
  });

  it.each(['sample', true, 1.23, '679e467f9f878a9587eebdb7'])(
    'should throw validation error on invalid id',
    async (id) => {
      const metadata = new Metadata();

      const res = await new Promise<FindOneResolveType>(
        (resolve, _) => {
          client.findOne(
            { id: id as string },
            metadata,
            (error: GrpcErrorResponse, response: User) => {
              if (error) {
                return resolve([error, null]);
              }
              resolve([null, response]);
            },
          );
        },
      );

      expect(res[0].details).toEqual('id must be a UUID');
    },
  );

  it('should return a user by their id', async () => {
    const metadata = new Metadata();

    const res = await new Promise<FindOneResolveType>(
      (resolve, _) => {
        client.findOne(
          {
            id: '446ca4ee-007e-4951-8d4e-fa3027581793',
          },
          metadata,
          (error: GrpcErrorResponse, response: User) => {
            if (error) {
              return resolve([error, null]);
            }
            resolve([null, response]);
          },
        );
      },
    );

    expect(res).toEqual([
      null,
      {
        id: '446ca4ee-007e-4951-8d4e-fa3027581793',
        name: 'somename',
      },
    ]);
  });
});
