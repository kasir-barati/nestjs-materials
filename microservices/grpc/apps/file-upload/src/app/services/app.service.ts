import { S3Client } from '@aws-sdk/client-s3';
import {
  CORRELATION_ID_CLS_KEY,
  CorrelationIdService,
} from '@grpc/modules';
import { constraintsToString } from '@grpc/shared';
import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { isEmpty, validate } from 'class-validator';
import { UseCls } from 'nestjs-cls';
import { extname } from 'path';
import { concatMap, Observable, ReplaySubject } from 'rxjs';

import { UploadResponse } from '../../assets/interfaces/file-upload.interface';
import { ChunkDto } from '../dtos/chunk.dto';
import { FileService } from './file.service';

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name);

  constructor(
    private readonly correlationIdService: CorrelationIdService,
    private readonly s3Client: S3Client,
  ) {}

  upload(
    subject: ReplaySubject<UploadResponse>,
    observableChunk: Observable<ChunkDto>,
  ) {
    const correlationId =
      this.correlationIdService.getCorrelationIdOrGenerate();
    let fileService: FileService | undefined;

    observableChunk
      .pipe(
        concatMap((unvalidatedData) => {
          return this.correlationIdService.useCorrelationId(
            correlationId,
            async () => {
              const validatedData = await this.validateIncomingData(
                correlationId,
                unvalidatedData,
              );

              if (validatedData.partNumber === 1) {
                const createdFileService =
                  await this.startMultipartUpload(correlationId, {
                    data: validatedData,
                    subject,
                    totalSize: validatedData.totalSize,
                    receivedSize: validatedData.data.length,
                  });

                fileService = createdFileService;
              }

              if (!fileService) {
                throw 'File service is not initialized!';
              }

              await fileService.uploadPart(
                validatedData.partNumber,
                validatedData.data,
              );

              if (isEmpty(validatedData.checksum)) {
                return false;
              }

              await fileService.completeMultipartUpload(
                validatedData.checksum,
              );

              return true;
            },
          );
        }),
      )
      .subscribe({
        next: (hasCompleted) => {
          if (!hasCompleted) {
            subject.next({});
            return;
          }

          subject.complete();
        },
        complete: () => {
          this.logger.log('Multipart upload was completed!');
        },
        error: (error) => {
          this.handleError(correlationId, {
            error,
            subject,
            fileService,
          });
        },
      });
  }

  @UseCls<[string, ChunkDto]>({
    setup: (cls, correlationId, _chunkDto) => {
      cls.set(CORRELATION_ID_CLS_KEY, correlationId);
    },
  })
  private async validateIncomingData(
    correlationId: string,
    unvalidatedData: ChunkDto,
  ): Promise<ChunkDto> {
    const data = plainToInstance(ChunkDto, unvalidatedData, {
      enableImplicitConversion: true,
    });
    const validationResult = await validate(data);

    if (validationResult.length > 0) {
      const error = constraintsToString(validationResult);
      throw error?.join(', ') ?? 'Validation failed';
    }

    return data;
  }

  @UseCls<[string, unknown]>({
    setup: (cls, correlationId, _args) => {
      cls.set(CORRELATION_ID_CLS_KEY, correlationId);
    },
  })
  private async startMultipartUpload(
    correlationId: string,
    args: {
      data: ChunkDto;
      subject: ReplaySubject<UploadResponse>; // remove it
      receivedSize: number;
      totalSize: number;
    },
  ): Promise<FileService> {
    const bucket = 'some-bucket';
    const key = args.data.id + extname(args.data.fileName);
    const fileService = new FileService(this.s3Client);

    await fileService.createMultipartUpload({
      bucketName: bucket,
      objectKey: key,
      filename: args.data.fileName,
      checksumAlgorithm: args.data.checksumAlgorithm,
    });

    return fileService;
  }

  @UseCls<[string, unknown]>({
    setup: (cls, correlationId, _args) => {
      cls.set(CORRELATION_ID_CLS_KEY, correlationId);
    },
  })
  private async handleError(
    correlationId: string,
    args: {
      error: any;
      subject: ReplaySubject<UploadResponse>;
      fileService?: FileService;
    },
  ) {
    this.logger.error(args.error);

    if (args.fileService) {
      await args.fileService.abortMultipartUpload();
    }

    args.subject.error(new UnprocessableEntityException(args.error));
  }
}
