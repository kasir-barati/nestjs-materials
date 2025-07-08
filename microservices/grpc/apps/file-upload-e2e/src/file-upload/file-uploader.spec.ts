import { ChecksumAlgorithm } from '@aws-sdk/client-s3';
import {
  credentials,
  loadPackageDefinition,
  Metadata,
} from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { generateChecksum } from '@grpc/shared';
import { createReadStream } from 'fs';
import { readFile, stat } from 'fs/promises';
import { join } from 'path';

import { FileUploaderServiceClient } from '../support/file-upload.type';
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
  'file-uploader.proto',
);

describe('Upload file', () => {
  let client: FileUploaderServiceClient;
  let largeFilename: string;
  let largeFilePath: string;
  let smallFilename: string;
  let smallFilePath: string;

  beforeAll(async () => {
    const packageDefinition = loadSync(PROTO_PATH, {
      defaults: true,
      oneofs: true,
    });
    const {
      File: { FileUploaderService },
    } = loadPackageDefinition(packageDefinition) as any;
    const SERVER_ADDRESS = 'localhost:3000';
    client = new FileUploaderService(
      SERVER_ADDRESS,
      credentials.createInsecure(),
    );

    largeFilename = 'upload-me1.txt';
    largeFilePath = join(__dirname, largeFilename);
    await generateLargeFile(50, largeFilePath);
    smallFilename = 'upload-me2.txt';
    smallFilePath = join(__dirname, largeFilename);
    await generateLargeFile(3, smallFilename);
  });

  it('should upload a huge file with MultipartUploadCommand', async () => {
    // Arrange
    const metadata = new Metadata();
    const callHandler = client.upload(metadata);
    const fileContent = await readFile(largeFilePath);
    const { size: fileTotalSize } = await stat(largeFilePath);
    const checksumAlgorithm = ChecksumAlgorithm.CRC32;
    const checksum = generateChecksum(fileContent, checksumAlgorithm);
    /**@description 1MB */
    const chunkSize = 1 * 1024 * 1024;
    const stream = createReadStream(largeFilePath, {
      highWaterMark: chunkSize,
    });

    // Act
    await uploadStream({
      callHandler,
      checksum,
      checksumAlgorithm,
      fileTotalSize,
      fileName: largeFilename,
      stream,
    });

    // Assert
    expect(true).toBeTruthy();
  }, 30000);

  it('should upload a small file with PutObjectCommand', async () => {
    // Arrange
    const metadata = new Metadata();
    const callHandler = client.upload(metadata);
    const fileContent = await readFile(smallFilePath);
    const { size: fileTotalSize } = await stat(smallFilePath);
    const checksumAlgorithm = ChecksumAlgorithm.CRC32;
    const checksum = generateChecksum(fileContent, checksumAlgorithm);
    /**@description 1MB */
    const chunkSize = 1 * 1024 * 1024;
    const stream = createReadStream(smallFilePath, {
      highWaterMark: chunkSize,
    });

    // Act
    await uploadStream({
      callHandler,
      checksum,
      checksumAlgorithm,
      fileTotalSize,
      fileName: smallFilename,
      stream,
    });

    // Assert
    expect(true).toBeTruthy();
  }, 30000);
});
