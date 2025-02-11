import { ChannelCredentials, Metadata } from '@grpc/grpc-js';
import { ClientDuplexStreamImpl } from '@grpc/grpc-js/build/src/call';
import { GrpcErrorResponse } from '@grpc/shared';
import {
  Chunk,
  UploadResponse,
} from '../../../file-upload/src/assets/interfaces/file-upload.interface';

export type UploadResolveType = GrpcErrorResponse | Error | null;
export interface FileUploadServiceClient {
  upload(
    metadata: Metadata,
  ): ClientDuplexStreamImpl<Chunk, UploadResponse>;
}
interface FileUploadService {
  new (
    url: string,
    credentials: ChannelCredentials,
  ): FileUploadServiceClient;
}
export interface LoadPackageDefinition {
  /**@description The name of our package which we wrote in our `file-upload.proto` file. */
  user: {
    /**@description Comes from the name we gave to this service in our `file-upload.proto` file. */
    FileUploadService: FileUploadService;
  };
}
