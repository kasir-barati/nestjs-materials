import { ChecksumAlgorithm } from '@aws-sdk/client-s3';
import {
  credentials,
  loadPackageDefinition,
  Metadata,
} from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { createHash, randomUUID } from 'crypto';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { join } from 'path';
import {
  Chunk,
  UploadResponse,
} from '../../../file-upload/src/assets/interfaces/file-upload.interface';
import {
  FileUploadServiceClient,
  LoadPackageDefinition,
  UploadResolveType,
} from '../support/file-upload.type';

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

  beforeAll(() => {
    const packageDefinition = loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
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
    );
  });

  it('should throw error on invalid file', async () => {
    // Arrange
    const metadata = new Metadata();
    const callHandler = client.upload(metadata);
    const responses = [];
    const fileId = randomUUID();
    const fileName = 'upload-me.jpg';
    const filePath = join(__dirname, fileName);
    const { size: fileTotalSize } = await stat(filePath);
    const stream = createReadStream(filePath);
    let partNumber = 1;
    callHandler.on('data', (response: UploadResponse) =>
      responses.push(response),
    );

    // Act
    const error = await new Promise<UploadResolveType>(
      (resolve, _) => {
        const errorHandler = (error: Error) => {
          if (error) {
            return resolve(error);
          }
          resolve(
            new Error(
              'Error was null but error handler was invoked!',
            ),
          );
        };
        const endHandler = () => {
          callHandler.end(() => {
            // Close the stream to prevent failing test due to open streams.
            stream.close();
            resolve(null);
          });
        };

        stream
          .on('data', (chunk) => {
            const data = Uint8Array.from(Buffer.from(chunk));
            const checksumAlgorithm = ChecksumAlgorithm.SHA256;
            const checksum = createHash(checksumAlgorithm)
              .update(chunk.toString(), 'utf-8')
              .digest('hex');

            callHandler.on('error', errorHandler);
            callHandler.write(
              {
                data,
                fileName,
                checksum,
                checksumAlgorithm,
                id: fileId,
                totalSize: fileTotalSize,
                partNumber: partNumber++,
              } satisfies Chunk,
              'utf-8',
              errorHandler,
            );
          })
          .on('error', errorHandler)
          .on('end', endHandler);
      },
    );

    // Assert
    expect(error).toBe(null);
  });
});
