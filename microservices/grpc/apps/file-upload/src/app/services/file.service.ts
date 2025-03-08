import {
  AbortMultipartUploadCommand,
  ChecksumAlgorithm,
  CompletedPart,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { InternalServerErrorException } from '@nestjs/common';

export class FileService {
  private uploadId?: string;
  private bucketName?: string;
  private objectKey?: string;
  private checksumAlgorithm?: string;
  private parts: CompletedPart[] = [];

  constructor(private readonly s3Client: S3Client) {}

  /**
   *
   * @returns upload ID. We'll use this ID to associate all of the parts in the specific multipart upload.
   */
  async createMultipartUpload(
    bucketName: string,
    objectKey: string,
    checksumAlgorithm: ChecksumAlgorithm,
  ) {
    const command = new CreateMultipartUploadCommand({
      Bucket: bucketName,
      Key: objectKey,
      ChecksumAlgorithm: checksumAlgorithm,
      ChecksumType: 'FULL_OBJECT',
    });
    const response = await this.s3Client.send(command);

    if (!response.UploadId) {
      throw new InternalServerErrorException('UploadId is missing');
    }

    this.objectKey = objectKey;
    this.bucketName = bucketName;
    this.uploadId = response.UploadId;
    this.checksumAlgorithm = checksumAlgorithm;
  }

  async uploadPart(chunkPart: number, data: Uint8Array) {
    if (!this.uploadId) {
      throw 'Upload ID does not exists!';
    }

    const command = new UploadPartCommand({
      Bucket: this.bucketName,
      Key: this.objectKey,
      UploadId: this.uploadId,
      PartNumber: chunkPart,
      Body: data,
    });
    const response = await this.s3Client.send(command);

    this.parts.push({
      PartNumber: chunkPart,
      ETag: response.ETag,
    });
  }

  async completeMultipartUpload(checksum: string) {
    const command = new CompleteMultipartUploadCommand({
      Bucket: this.bucketName,
      Key: this.objectKey,
      UploadId: this.uploadId,
      ChecksumType: 'FULL_OBJECT',
      [`Checksum` + this.checksumAlgorithm]: checksum,
      MultipartUpload: { Parts: this.parts },
    });

    await this.s3Client.send(command);
  }

  async abortMultipartUpload() {
    const command = new AbortMultipartUploadCommand({
      Bucket: this.bucketName,
      Key: this.objectKey,
      UploadId: this.uploadId,
    });

    await this.s3Client.send(command);
  }
}
