import { S3Client } from '@aws-sdk/client-s3';
import { CorrelationIdService } from '@grpc/modules';
import {
  BadRequestException,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { isEmpty, isNotEmpty } from 'class-validator';
import { concatMap, Observable, ReplaySubject } from 'rxjs';

import { UploadResponse } from '../../assets/interfaces/file-upload.interface';
import { ChunkDto, validateData } from '../../shared';
import { UploaderService } from './uploader.service';

@Injectable()
export class FileUploaderService {
  private readonly logger = new Logger(FileUploaderService.name);

  constructor(
    private readonly correlationIdService: CorrelationIdService,
    private readonly s3Client: S3Client,
  ) {}

  upload(
    subject: ReplaySubject<UploadResponse>,
    chunk: Observable<ChunkDto>,
  ) {
    const correlationId =
      this.correlationIdService.getCorrelationIdOrGenerate();
    let uploaderService: UploaderService | undefined;
    const bucketName = 'some-bucket';

    chunk
      .pipe(
        concatMap((unvalidatedData) => {
          return this.correlationIdService.useCorrelationId(
            correlationId,
            async () => {
              const validatedData = await validateData(
                unvalidatedData,
                ChunkDto,
              );

              if (validatedData.partNumber === 1) {
                if (isEmpty(validatedData.fileName)) {
                  throw new BadRequestException(
                    'file_name is mandatory to be sent with the first message!',
                  );
                }
                if (isEmpty(validatedData.checksumAlgorithm)) {
                  throw new BadRequestException(
                    'checksum_algorithm is mandatory to be sent with the first message!',
                  );
                }

                const objectKey = validatedData.fileName;

                uploaderService = new UploaderService(
                  this.s3Client,
                  validatedData.fileName,
                  objectKey,
                  bucketName,
                  validatedData.checksumAlgorithm,
                );
              }

              console.dir(validatedData, { depth: null });

              await uploaderService.upload(
                validatedData.data,
                isNotEmpty(validatedData.checksum), // checksum existence signals that it is the last chunk
                validatedData.checksum,
              );

              return isNotEmpty(validatedData.checksum);
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
          this.correlationIdService.useCorrelationId(
            correlationId,
            () => {
              this.logger.log('Multipart upload was completed!');
            },
          );
        },
        error: (error) => {
          this.correlationIdService.useCorrelationId(
            correlationId,
            async () => {
              this.logger.error(error);

              if (uploaderService) {
                await uploaderService.abortUpload();
              }

              subject.error(new UnprocessableEntityException(error));
            },
          );
        },
      });
  }
}
