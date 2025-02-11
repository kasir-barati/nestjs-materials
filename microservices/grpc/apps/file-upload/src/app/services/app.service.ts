import {
  CorrelationIdService,
  UseCorrelationId,
} from '@grpc/modules';
import { constraintsToString } from '@grpc/shared';
import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { extname } from 'path';
import { mergeMap, Observable, ReplaySubject } from 'rxjs';
import { UploadResponse } from '../../assets/interfaces/file-upload.interface';
import { ChunkDto } from '../dtos/chunk.dto';
import { FileService } from './file.service';

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name);

  constructor(
    private readonly correlationIdService: CorrelationIdService,
    private readonly fileService: FileService,
  ) {}

  upload(
    subject: ReplaySubject<UploadResponse>,
    observableChunk: Observable<ChunkDto>,
  ) {
    let once = true;
    let receivedSize = 0;
    let totalSize = 0;
    let uploadId: string | undefined;
    let fileId: string | undefined;
    let fileName: string | undefined;
    const etags: string[] = [];
    const correlationId =
      this.correlationIdService.getCorrelationIdOrGenerate();

    observableChunk
      .pipe(
        mergeMap((data) => {
          fileId = data.id;
          fileName = data.fileName;

          if (once) {
            return this.startMultipartUpload(correlationId, {
              data,
              subject,
              totalSize,
              receivedSize,
            });
          }

          if (!uploadId) {
            throw 'Upload ID does not exists!';
          }

          return this.uploadPart(correlationId, {
            data,
            receivedSize,
            uploadId,
          });
        }),
      )
      .subscribe({
        next: (result) => {
          receivedSize = result.receivedSize;

          if ('etag' in result) {
            etags.push(result.etag);
            return;
          }

          once = false;
          totalSize = result.totalSize;
          uploadId = result.uploadId;
        },
        complete: () => {
          if (!fileId || !fileName || !uploadId) {
            throw 'fileId/fileName/uploadId is missing!';
          }

          this.handleComplete(correlationId, {
            subject,
            totalSize,
            receivedSize,
            uploadId,
            fileId,
            fileName,
          });
        },
        error: (error) => {
          if (!fileId || !fileName || !uploadId) {
            throw 'fileId/fileName/uploadId is missing!';
          }

          this.handleError(correlationId, {
            error,
            subject,
            fileId,
            fileName,
            uploadId,
          });
        },
      });
  }

  @UseCorrelationId()
  private async startMultipartUpload(
    correlationId: string,
    args: {
      data: ChunkDto;
      subject: ReplaySubject<UploadResponse>; // remove it
      receivedSize: number;
      totalSize: number;
    },
  ) {
    let { data, subject, receivedSize, totalSize } = args;
    let uploadId: string | undefined;
    const unvalidatedChunk = plainToClass(ChunkDto, data);
    const validationResult = await validate(unvalidatedChunk);
    const bucket = this.getBucket();
    const key = this.getKey(data.id, data.fileName);

    // TODO: How I can get rid of this try catch?
    try {
      if (validationResult.length > 0) {
        const error = constraintsToString(validationResult);
        throw error ?? 'Validation failed';
      }

      uploadId = await this.fileService.createMultipartUpload(
        bucket,
        key,
        data.checksumAlgorithm,
      );

      await this.fileService.uploadPart(
        bucket,
        key,
        uploadId,
        data.partNumber,
        data.data,
      );

      receivedSize += data.data.length;
      totalSize = data.totalSize;

      this.logger.log(
        `Received ${receivedSize} bytes of ${totalSize} bytes`,
      );
    } catch (error) {
      this.logger.error(error);

      subject.error(error);
    } finally {
      subject.next({});

      return { receivedSize, uploadId, totalSize };
    }
  }

  @UseCorrelationId()
  private async uploadPart(
    correlationId: string,
    args: {
      data: ChunkDto;
      receivedSize: number;
      uploadId: string;
    },
  ) {
    const { data, uploadId } = args;
    const bucket = this.getBucket();
    const key = this.getKey(data.id, data.fileName);
    const etag = await this.fileService.uploadPart(
      bucket,
      key,
      uploadId,
      data.partNumber,
      data.data,
    );
    const receivedSize = args.receivedSize + data.data.length;

    return { receivedSize, etag };
  }

  @UseCorrelationId()
  private async handleError(
    correlationId: string,
    args: {
      error: any;
      subject: ReplaySubject<UploadResponse>;
      uploadId: string;
      fileId: string;
      fileName: string;
    },
  ) {
    const { error, subject, fileId, fileName, uploadId } = args;
    const bucket = this.getBucket();
    const key = this.getKey(fileId, fileName);

    this.logger.error(error);

    await this.fileService.abortMultipartUpload(
      bucket,
      key,
      uploadId,
    );

    // TODO: should I be doing this in a single place?
    subject.error(new UnprocessableEntityException(error));
  }

  @UseCorrelationId()
  private async handleComplete(
    correlationId: string,
    args: {
      subject: ReplaySubject<UploadResponse>;
      receivedSize: number;
      totalSize: number;
      fileId: string;
      fileName: string;
      uploadId: string;
    },
  ) {
    const {
      subject,
      fileId,
      fileName,
      receivedSize,
      totalSize,
      uploadId,
    } = args;

    if (receivedSize !== totalSize) {
      this.logger.error(
        `Received size ${receivedSize} does not match total size ${totalSize}`,
      );

      // Throw error and handle it in the main function inside a catchError operator
      subject.error(
        new UnprocessableEntityException(
          'Received size does not match the total size',
        ),
      );
      return;
    }

    const bucket = this.getBucket();
    const key = this.getKey(fileId, fileName);

    await this.fileService.completeMultipartUpload(
      bucket,
      key,
      uploadId,
    );

    subject.complete();
  }

  getBucket() {
    return 'some_bucket';
  }

  getKey(id: string, filename: string) {
    return id + extname(filename);
  }
}
