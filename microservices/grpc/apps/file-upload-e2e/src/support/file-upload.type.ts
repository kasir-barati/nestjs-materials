import { ChecksumAlgorithm } from '@aws-sdk/client-s3';
import { ChannelCredentials, Metadata } from '@grpc/grpc-js';
import {
  ClientDuplexStreamImpl,
  ClientReadableStreamImpl,
} from '@grpc/grpc-js/build/src/call';
import { ReadStream } from 'fs';

import {
  Chunk,
  DownloadRequest,
  DownloadResponse,
  UploadResponse,
} from '../../../file-upload/src/assets/interfaces/file-upload.interface';

export interface FileUploadServiceClient {
  upload(
    metadata: Metadata,
  ): ClientDuplexStreamImpl<Chunk, UploadResponse>;
  download(
    request: DownloadRequest,
    metadata: Metadata,
  ): ClientReadableStreamImpl<DownloadResponse>;
}
interface FileUploadService {
  new (
    url: string,
    credentials: ChannelCredentials,
    option?: { 'grpc.max_send_message_length': number },
  ): FileUploadServiceClient;
}
export interface LoadPackageDefinition {
  /**@description The name of our package which we wrote in our `file-upload.proto` file. */
  File: {
    /**@description Comes from the name we gave to this service in our `file-upload.proto` file. */
    FileUploadService: FileUploadService;
  };
}

export interface UploadStreamArguments {
  checksum: string;
  callHandler: ClientDuplexStreamImpl<Chunk, UploadResponse>;
  stream: ReadStream;
  fileTotalSize: number;
  fileName: string;
  checksumAlgorithm: ChecksumAlgorithm;
  id?: string;
}
