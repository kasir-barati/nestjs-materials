import { ChecksumAlgorithm } from '@aws-sdk/client-s3';
import {
  credentials,
  loadPackageDefinition,
  Metadata,
} from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { generateChecksum, GrpcErrorResponse } from '@grpc/shared';
import { randomUUID } from 'crypto';
import { createReadStream } from 'fs';
import { readFile, stat } from 'fs/promises';
import { join } from 'path';

import {
  FileUploadServiceClient,
  LoadPackageDefinition,
} from '../support/file-upload.type';
import { generateLargeFile } from '../support/gen-huge-file';
import { uploadStream } from '../support/upload-stream';

const PROTO_PATH = join(
  __dirname,
  '..',
  '..',
  '..',
  'file-upload',
  'src',
  'assets',
  'file-upload.proto',
);

describe('Upload file', () => {
  let client: FileUploadServiceClient;
  let fileName: string;
  let filePath: string;

  beforeAll(async () => {
    const packageDefinition = loadSync(PROTO_PATH, {
      defaults: true,
      oneofs: true,
    });
    const {
      File: { FileUploadService },
    } = loadPackageDefinition(
      packageDefinition,
    ) as unknown as LoadPackageDefinition;
    const SERVER_ADDRESS = 'localhost:3000';
    client = new FileUploadService(
      SERVER_ADDRESS,
      credentials.createInsecure(),
      { 'grpc.max_send_message_length': 6 * 1024 * 1024 },
    );

    fileName = 'upload-me.txt';
    filePath = join(__dirname, fileName);
    await generateLargeFile({
      filePath,
      sizeInMb: 7,
    });
  });

  // FIXME:
  it.skip('should throw error on invalid data', async () => {
    // Arrange
    const metadata = new Metadata();
    const callHandler = client.upload(metadata);
    const fileId = randomUUID();
    const fileName = 'upload-me.jpg';
    const filePath = join(__dirname, fileName);
    const stream = createReadStream(filePath);
    const checksumAlgorithm = ChecksumAlgorithm.SHA256;
    const fileContent = await readFile(filePath);
    const checksum = generateChecksum(fileContent, checksumAlgorithm);

    // Act
    const error = await new Promise<GrpcErrorResponse | Error | null>(
      (resolve, _) => {
        const errorHandler = (error: Error) => {
          if (!error) {
            return;
          }
          resolve(error);
        };
        const endHandler = () => {
          // Close the stream to prevent failing test due to open streams.
          stream.close();
          callHandler.end();
        };

        callHandler.on('error', errorHandler).on('end', resolve);

        stream
          .on('data', async (chunk) => {
            const data = Uint8Array.from(Buffer.from(chunk));

            callHandler.write(
              {
                data,
                checksum,
                id: fileId,
              },
              'utf-8',
              errorHandler,
            );
          })
          .on('error', errorHandler)
          .on('end', endHandler);
      },
    );

    // Assert
    expect(error['details']).toBe(
      'partNumber must be an integer number',
    );
  });

  it('should upload the file', async () => {
    // Arrange
    const metadata = new Metadata();
    const callHandler = client.upload(metadata);
    const fileContent = await readFile(filePath);
    const { size: fileTotalSize } = await stat(filePath);
    const checksumAlgorithm = ChecksumAlgorithm.CRC32;
    const checksum = generateChecksum(fileContent, checksumAlgorithm);
    /**@description 5MB */
    const chunkSize = 5 * 1024 * 1024;
    const stream = createReadStream(filePath, {
      highWaterMark: chunkSize,
    });

    // Act
    await uploadStream({
      callHandler,
      checksum,
      checksumAlgorithm,
      fileTotalSize,
      fileName,
      stream,
    });

    // Assert
    expect(true).toBeTruthy();
  }, 30000);

  it('should download the uploaded file', async () => {
    // Arrange
    const metadata = new Metadata();
    const uploadCallHandler = client.upload(metadata);
    const fileContent = await readFile(filePath);
    const { size: fileTotalSize } = await stat(filePath);
    const checksumAlgorithm = ChecksumAlgorithm.CRC32;
    const checksum = generateChecksum(fileContent, checksumAlgorithm);
    /**@description 5MB */
    const chunkSize = 5 * 1024 * 1024;
    const stream = createReadStream(filePath, {
      highWaterMark: chunkSize,
    });
    const id = randomUUID();
    await uploadStream({
      callHandler: uploadCallHandler,
      checksum,
      checksumAlgorithm,
      fileTotalSize,
      fileName,
      stream,
      id,
    });

    // Act
    await new Promise<void>((resolve, reject) => {
      const callHandler = client.download({ id }, metadata);
      callHandler.on('data', (res) => console.log(res));
      callHandler.on('error', (err) => reject(err));
      callHandler.on('end', () => resolve());
    });

    // Assert
    expect(true).toBeTruthy();
  }, 30000);
});
