import { ChannelCredentials } from '@grpc/grpc-js';
import {
  GrpcUserServiceClient,
  User,
} from '../../../nestjs-client/src/assets/interfaces/user.interface';
import { GrpcErrorResponse } from './shared.type';

interface GrpcUserService {
  new (
    url: string,
    credentials: ChannelCredentials,
  ): GrpcUserServiceClient;
}
export type FindOneResolveType = [
  GrpcErrorResponse | null,
  User | null,
];
export interface LoadPackageDefinition {
  /**@description The name of our package which we wrote in our `user.proto` file. */
  user: {
    /**@description Comes from the name we gave to this service in our `user.proto` file. */
    GrpcUserService: GrpcUserService;
  };
}
