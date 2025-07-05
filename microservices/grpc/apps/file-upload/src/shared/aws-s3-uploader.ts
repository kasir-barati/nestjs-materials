import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CompleteMultipartUploadCommandOutput,
  CreateMultipartUploadCommand,
  CreateMultipartUploadCommandOutput,
  HeadObjectCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { fromIni } from '@aws-sdk/credential-providers';
import { createHash } from 'crypto';
import { FileHandle, open, readFile, unlink } from 'fs/promises';
import { basename, dirname, extname, join } from 'path';

import { Chunk } from './chunk';
import { getFileSize, getMd5 } from './utils';

export class AwsS3Uploader {
  private s3Client: S3Client;
  private multipartLimitSize: number;

  constructor(multipartLimitSizeMib = 512, awsProfile?: string) {
    this.s3Client = new S3Client({
      credentials: awsProfile
        ? fromIni({ profile: awsProfile })
        : undefined,
    });
    this.multipartLimitSize = multipartLimitSizeMib * 1024 * 1024;
  }

  async uploadFile(
    filePath: string,
    destinationPath: string,
  ): Promise<boolean> {
    if (await this.isBiggerThanMultiPartLimit(filePath)) {
      return this.uploadMultiPartCustom(
        filePath,
        destinationPath,
        100,
      );
    }

    return this.uploadSinglePart(filePath, destinationPath);
  }

  private async isBiggerThanMultiPartLimit(
    filePath: string,
  ): Promise<boolean> {
    const fileSize = await getFileSize(filePath);

    return fileSize > this.multipartLimitSize;
  }

  async validateFile(
    destinationPath: string,
    md5: string,
  ): Promise<boolean> {
    const etag = await this.getEtag(destinationPath);

    return etag === md5;
  }

  private async uploadSinglePart(
    originPath: string,
    destinationPath: string,
    validate = true,
  ): Promise<boolean> {
    const bucket = this.getBucketName(destinationPath);
    const key =
      this.getFileKey(destinationPath) || basename(originPath);

    await this.s3Client.send(
      new CreateMultipartUploadCommand({
        Bucket: bucket,
        Key: key,
      }),
    );

    if (validate) {
      await this.assertFileCorruption(originPath, destinationPath);
    }

    return true;
  }

  private async assertFileCorruption(
    originPath: string,
    destinationPath: string,
  ): Promise<void> {
    const md5 = await getMd5(originPath, 104857600);
    const etag = await this.getEtag(destinationPath);

    if (md5 !== etag) {
      throw new Error('Validation Error: MD5 mismatch');
    }
  }

  private async startMultipartUpload(
    originPath: string,
    destinationPath: string,
  ): Promise<CreateMultipartUploadCommandOutput> {
    return this.s3Client.send(
      new CreateMultipartUploadCommand({
        Bucket: this.getBucketName(destinationPath),
        Key: this.getFileKey(destinationPath) ?? basename(originPath),
      }),
    );
  }

  private async uploadMultipartPart(
    uploadMeta: CreateMultipartUploadCommandOutput,
    chunk: Chunk,
    retries = 3,
  ): Promise<boolean> {
    try {
      const fileStream = await readFile(chunk.path);
      const response = await this.s3Client.send(
        new UploadPartCommand({
          Bucket: uploadMeta.Bucket,
          Key: uploadMeta.Key,
          PartNumber: chunk.partNumber,
          UploadId: uploadMeta.UploadId,
          Body: fileStream,
        }),
      );

      const etag = response.ETag?.replace(/"/g, '');

      if (!etag) {
        throw new Error('No ETag received');
      }

      if (chunk.validate(etag)) {
        return true;
      }

      if (retries <= 0) {
        throw new Error(`Part ${chunk.partNumber} validation failed`);
      }

      return this.uploadMultipartPart(uploadMeta, chunk, retries - 1);
    } catch (error) {
      if (retries <= 0) {
        throw error;
      }

      return this.uploadMultipartPart(uploadMeta, chunk, retries - 1);
    } finally {
      // TODO: Abort the upload
    }
  }

  private async completeMultipartUpload(
    uploadMeta: CreateMultipartUploadCommandOutput,
    chunks: Chunk[],
  ): Promise<CompleteMultipartUploadCommandOutput> {
    const parts = chunks.map((chunk) => ({
      ETag: chunk.etag,
      PartNumber: chunk.partNumber,
    }));

    return this.s3Client.send(
      new CompleteMultipartUploadCommand({
        Bucket: uploadMeta.Bucket,
        Key: uploadMeta.Key,
        UploadId: uploadMeta.UploadId,
        MultipartUpload: { Parts: parts },
      }),
    );
  }

  private async abortMultipartUpload(
    uploadMeta: CreateMultipartUploadCommandOutput,
  ): Promise<void> {
    await this.s3Client.send(
      new AbortMultipartUploadCommand({
        Bucket: uploadMeta.Bucket,
        Key: uploadMeta.Key,
        UploadId: uploadMeta.UploadId,
      }),
    );
  }

  private async uploadMultiPartCustom(
    originPath: string,
    destinationPath: string,
    chunkSizeMib = 1024,
    tmpDir?: string,
    validate = true,
  ): Promise<boolean> {
    if (!destinationPath.startsWith('s3://')) {
      throw new Error('Destination must be an S3 path');
    }

    const uploadMeta = await this.startMultipartUpload(
      originPath,
      destinationPath,
    );
    const chunks: Chunk[] = [];
    let reader: FileHandle | undefined;

    try {
      const fileSize = await getFileSize(originPath);
      const chunkSizeBytes = chunkSizeMib * 1024 * 1024;
      const tmpDirToUse = tmpDir ?? dirname(originPath);
      const chunkBasename = basename(originPath, extname(originPath));

      reader = await open(originPath, 'r');
      let readPosition = 0;
      let chunkPart = 1;

      while (readPosition < fileSize) {
        const chunkPath = join(
          tmpDirToUse,
          `${chunkBasename}_chunk_${chunkPart}`,
        );
        const chunk = new Chunk(chunkPath, chunkPart, chunkSizeBytes);

        await chunk.createChunk(reader);

        chunks.push(chunk);

        console.log(`Uploading chunk #${chunkPart}`);

        await this.uploadMultipartPart(uploadMeta, chunk);

        readPosition += chunk.size;
        chunkPart++;
      }

      const completeResponse = await this.completeMultipartUpload(
        uploadMeta,
        chunks,
      );
      const etag = completeResponse.ETag?.replace(/"/g, '');

      if (validate && etag && !this.isValidMultipart(chunks, etag)) {
        throw new Error('Multipart upload validation failed');
      }

      return true;
    } catch (error) {
      await this.abortMultipartUpload(uploadMeta);
      throw error;
    } finally {
      if (reader) {
        await reader.close();
      }
      for (const chunk of chunks) {
        await unlink(chunk.path).catch((err) => {
          console.error(
            `Error cleaning up chunk ${chunk.path}: ${err}`,
          );
        });
      }
    }
  }

  private async getEtag(s3Path: string): Promise<string> {
    const response = await this.s3Client.send(
      new HeadObjectCommand({
        Bucket: this.getBucketName(s3Path),
        Key: this.getFileKey(s3Path),
      }),
    );

    return response.ETag?.replace(/"/g, '') || '';
  }

  private isValidMultipart(chunks: Chunk[], etag: string): boolean {
    const concatenated = Buffer.concat(
      chunks.map((chunk) => chunk.md5Bytes),
    );
    const combinedMd5 = createHash('md5')
      .update(concatenated)
      .digest('hex');
    const [hashPart, countPart] = etag.split('-');

    return (
      hashPart === combinedMd5 &&
      countPart === chunks.length.toString()
    );
  }

  private getBucketName(bucketPath: string): string {
    return new URL(bucketPath).hostname;
  }

  private getFileKey(bucketPath: string): string {
    return new URL(bucketPath).pathname.substring(1);
  }
}
