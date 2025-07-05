import { HttpToGrpcExceptionFilter } from '@grpc/shared';
import { Controller, UseFilters } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { Observable, ReplaySubject } from 'rxjs';

import {
  DownloadRequest,
  DownloadResponse,
  UploadResponse,
} from '../assets/interfaces/file-upload.interface';
import {
  FileUploaderServiceController,
  FileUploaderServiceControllerMethods,
} from '../assets/interfaces/file-uploader.interface';
import { ChunkDto } from '../shared';
import { FileUploaderService } from './services/file-uploader.service';

@Controller()
@UseFilters(HttpToGrpcExceptionFilter)
@FileUploaderServiceControllerMethods()
export class FileUploaderGrpcController
  implements FileUploaderServiceController
{
  constructor(
    private readonly fileUploaderService: FileUploaderService,
  ) {}

  upload(
    @Payload() chunk: Observable<ChunkDto>,
  ): Observable<UploadResponse> {
    const subject = new ReplaySubject<UploadResponse>(1);

    this.fileUploaderService.upload(subject, chunk);

    return subject.asObservable();
  }

  download(_request: DownloadRequest): Observable<DownloadResponse> {
    throw new Error('Method not implemented.');
  }
}
