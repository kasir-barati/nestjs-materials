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

import { Chunk } from '../../../file-upload/src/assets/interfaces/file-upload.interface';
import {
  FileUploadServiceClient,
  LoadPackageDefinition,
} from '../support/file-upload.type';
import { generateLargeFile } from '../support/gen-huge-file';

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
  let fileTotalSize: number;

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
      sizeInMb: 15,
    });
    const { size } = await stat(filePath);
    fileTotalSize = size;
  }, 20000);

  it('should throw error on invalid data', async () => {
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

  it.only('should upload the file', async () => {
    // Arrange
    const metadata = new Metadata();
    const callHandler = client.upload(metadata);
    const fileId = randomUUID();
    const fileContent = await readFile(filePath);
    const checksumAlgorithm = ChecksumAlgorithm.CRC32;
    const checksum = generateChecksum(fileContent, checksumAlgorithm);
    const stream = createReadStream(filePath, {
      highWaterMark: 5 * 1024 * 1024, // 5MB
    });
    let isFirstCall = true;
    let partNumber = 1;
    callHandler
      .on('error', (error: Error) => {
        if (error) {
          console.error(error);
        }
      })
      .on('end', console.log)
      .on('close', console.log)
      .on('finish', console.log);

    // Act
    for await (const chunk of stream) {
      const data = Uint8Array.from(Buffer.from(chunk));
      let messagePayload: Chunk = {
        data,
        checksum,
        partNumber: partNumber++,
      };
      if (isFirstCall) {
        isFirstCall = false;
        messagePayload = {
          ...messagePayload,
          fileName,
          checksumAlgorithm,
          id: fileId,
          totalSize: fileTotalSize,
          checksum: undefined,
        };
      }
      callHandler.write(messagePayload, 'utf-8');
      await new Promise((resolve) => callHandler.on('data', resolve));
    }
    stream.close(); // Close the stream to prevent failing test due to open streams.

    // Assert
    expect(true).toBeTruthy();
  }, 20000);
});
