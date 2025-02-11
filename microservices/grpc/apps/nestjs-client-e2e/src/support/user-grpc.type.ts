import { ChannelCredentials } from '@grpc/grpc-js';
import { GrpcErrorResponse } from '@grpc/shared';
import {
  GrpcUserServiceClient,
  User,
} from '../../../nestjs-client/src/assets/interfaces/user.interface';

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
/**@todo https://github.com/stephenh/ts-proto/issues/1159 */
export interface LoadPackageDefinition {
  /**@description The name of our package which we wrote in our `user.proto` file. */
  user: {
    /**@description Comes from the name we gave to this service in our `user.proto` file. */
    GrpcUserService: GrpcUserService;
  };
}
