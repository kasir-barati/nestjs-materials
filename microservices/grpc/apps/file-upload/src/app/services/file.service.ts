import {
  AbortMultipartUploadCommand,
  ChecksumAlgorithm,
  CompletedPart,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  GetObjectCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { InternalServerErrorException } from '@nestjs/common';
import mime from 'mime-types';

export class FileService {
  private uploadId?: string;
  private bucketName?: string;
  private objectKey?: string;
  private checksumAlgorithm?: string;
  private parts: CompletedPart[] = [];

  constructor(private readonly s3Client: S3Client) {}

  static async download({
    s3Client,
    bucketName,
    objectKey,
  }: {
    s3Client: S3Client;
    objectKey: string;
    bucketName: string;
  }) {
    const getObjectCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });
    /**
     * @description In case you need more info about the object feel free to use any of these. E.g. inside the ContentDisposition we have the filename.
     */
    const {
      Body,
      ContentDisposition,
      LastModified,
      ETag,
      ContentLength,
      ContentType,
    } = await s3Client.send(getObjectCommand);

    return Body.transformToWebStream();
  }

  async createMultipartUpload({
    bucketName,
    objectKey,
    filename,
    checksumAlgorithm,
  }: {
    filename: string;
    objectKey: string;
    bucketName: string;
    checksumAlgorithm: ChecksumAlgorithm;
  }) {
    const contentType = mime.lookup(filename);
    const command = new CreateMultipartUploadCommand({
      Bucket: bucketName,
      Key: objectKey,
      ChecksumAlgorithm: checksumAlgorithm,
      ChecksumType: 'FULL_OBJECT',
      ContentType: contentType === false ? 'unknown' : contentType,
      ContentDisposition: `attachment; filename="${filename}"`,
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
      ...(response.ChecksumCRC32 && {
        ChecksumCRC32: response.ChecksumCRC32,
      }),
      ...(response.ChecksumCRC32C && {
        ChecksumCRC32C: response.ChecksumCRC32C,
      }),
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
