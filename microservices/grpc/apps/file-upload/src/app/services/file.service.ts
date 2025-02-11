import {
  AbortMultipartUploadCommand,
  ChecksumAlgorithm,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class FileService {
  constructor(private readonly s3Client: S3Client) {}

  /**
   *
   * @returns upload ID. We'll use this ID to associate all of the parts in the specific multipart upload.
   */
  async createMultipartUpload(
    bucketName: string,
    key: string,
    checksumAlgorithm: ChecksumAlgorithm,
  ): Promise<string> {
    const command = new CreateMultipartUploadCommand({
      Bucket: bucketName,
      Key: key,
      ChecksumAlgorithm: checksumAlgorithm,
    });
    const response = await this.s3Client.send(command);

    if (!response.UploadId) {
      throw new InternalServerErrorException('UploadId is missing');
    }

    return response.UploadId;
  }

  /**@returns ETag for the uploaded part. Store them for later integrity check! */
  async uploadPart(
    bucketName: string,
    key: string,
    uploadId: string,
    chunkPart: number,
    data: Uint8Array,
  ) {
    const command = new UploadPartCommand({
      Bucket: bucketName,
      Key: key,
      UploadId: uploadId,
      PartNumber: chunkPart,
      Body: data,
    });
    const response = await this.s3Client.send(command);

    return response.ETag;
  }

  async completeMultipartUpload(
    bucketName: string,
    key: string,
    uploadId: string,
  ) {
    const command = new CompleteMultipartUploadCommand({
      Bucket: bucketName,
      Key: key,
      UploadId: uploadId,
    });
    const response = await this.s3Client.send(command);

    return response.ETag;
  }

  async abortMultipartUpload(
    bucketName: string,
    key: string,
    uploadId: string,
  ) {
    const command = new AbortMultipartUploadCommand({
      Bucket: bucketName,
      Key: key,
      UploadId: uploadId,
    });

    await this.s3Client.send(command);
  }
}
