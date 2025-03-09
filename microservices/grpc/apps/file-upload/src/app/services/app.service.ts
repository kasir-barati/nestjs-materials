import { S3Client } from '@aws-sdk/client-s3';
import { CorrelationIdService } from '@grpc/modules';
import { constraintsToString } from '@grpc/shared';
import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { extname } from 'path';
import { concatMap, Observable, of, ReplaySubject } from 'rxjs';

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
          return this.validateIncomingData(
            correlationId,
            unvalidatedData,
          );
        }),
        concatMap((data) => {
          if (data.partNumber !== 1) {
            return of({ fileService, data });
          }

          return this.startMultipartUpload(correlationId, {
            data,
            subject,
            totalSize: data.totalSize,
            receivedSize: data.data.length,
          });
        }),
        concatMap((startMultipartUploadResult) => {
          if (!fileService) {
            fileService = startMultipartUploadResult.fileService;
          }

          return this.uploadPart(correlationId, {
            data: startMultipartUploadResult.data,
            fileService,
          });
        }),
        concatMap((data) => {
          if (!data.checksum) {
            return Promise.resolve(false);
          }

          return this.completeMultipartUpload(correlationId, {
            fileService,
            checksum: data.checksum,
          });
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

  // @UseCorrelationId()
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

  // @UseCorrelationId()
  private async startMultipartUpload(
    correlationId: string,
    args: {
      data: ChunkDto;
      subject: ReplaySubject<UploadResponse>; // remove it
      receivedSize: number;
      totalSize: number;
    },
  ): Promise<{ fileService: FileService; data: ChunkDto }> {
    const bucket = 'some-bucket';
    const key = args.data.id + extname(args.data.fileName);
    const fileService = new FileService(this.s3Client);

    await fileService.createMultipartUpload(
      bucket,
      key,
      args.data.checksumAlgorithm,
    );

    return { fileService, data: args.data };
  }

  // @UseCorrelationId()
  private async uploadPart(
    correlationId: string,
    args: {
      data: ChunkDto;
      fileService: FileService;
    },
  ) {
    await args.fileService.uploadPart(
      args.data.partNumber,
      args.data.data,
    );

    return args.data;
  }

  // @UseCorrelationId()
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

  // @UseCorrelationId()
  private async completeMultipartUpload(
    correlationId: string,
    args: {
      fileService: FileService;
      checksum: string;
    },
  ) {
    await args.fileService.completeMultipartUpload(args.checksum);

    return true;
  }
}
