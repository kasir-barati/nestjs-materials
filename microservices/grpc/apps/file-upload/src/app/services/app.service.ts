import { S3Client } from '@aws-sdk/client-s3';
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
import { plainToInstance } from 'class-transformer';
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
    private readonly s3Client: S3Client,
  ) {}

  upload(
    subject: ReplaySubject<UploadResponse>,
    observableChunk: Observable<ChunkDto>,
  ) {
    let once = true;
    const correlationId =
      this.correlationIdService.getCorrelationIdOrGenerate();
    let fileService: FileService | undefined;

    subject.next({});

    observableChunk
      .pipe(
        mergeMap((unvalidatedData) => {
          return this.validateIncomingData(
            correlationId,
            unvalidatedData,
          );
        }),
        mergeMap((data) => {
          if (!once) {
            return Promise.resolve({ fileService, data });
          }

          return this.startMultipartUpload(correlationId, {
            data,
            subject,
            totalSize: data.totalSize,
            receivedSize: data.data.length,
          });
        }),
        mergeMap(async ({ data, fileService }) => {
          if (!fileService) {
            fileService = fileService;
          }

          return this.uploadPart(correlationId, {
            data,
            fileService,
          });
        }),
        mergeMap((data) => {
          if (!data.checksum) {
            return Promise.resolve(false);
          }

          return this.completeMultipartUpload(correlationId, {
            subject,
            fileService,
            checksum: data.checksum,
          });
        }),
      )
      .subscribe({
        next: (hasCompleted) => {
          if (once) {
            once = false;
          }

          if (!hasCompleted) {
            subject.next({});
          }
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

  @UseCorrelationId()
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
      throw error ?? 'Validation failed';
    }

    return data;
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
  ): Promise<{ fileService: FileService; data: ChunkDto }> {
    const bucket = this.getBucket();
    const key = args.data.id + extname(args.data.fileName);
    const fileService = new FileService(this.s3Client);

    await fileService.createMultipartUpload(
      bucket,
      key,
      args.data.checksumAlgorithm,
    );

    return { fileService, data: args.data };
  }

  @UseCorrelationId()
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

  @UseCorrelationId()
  private async handleError(
    correlationId: string,
    args: {
      error: any;
      subject: ReplaySubject<UploadResponse>;
      fileService: FileService;
    },
  ) {
    this.logger.error(args.error);

    await args.fileService.abortMultipartUpload();

    args.subject.error(new UnprocessableEntityException(args.error));
  }

  @UseCorrelationId()
  private async completeMultipartUpload(
    correlationId: string,
    args: {
      subject: ReplaySubject<UploadResponse>;
      fileService: FileService;
      checksum: string;
    },
  ) {
    await args.fileService.completeMultipartUpload(args.checksum);

    args.subject.complete();
    return true;
  }

  getBucket() {
    return 'some_bucket';
  }
}
