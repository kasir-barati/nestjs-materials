import { HttpToGrpcExceptionFilter } from '@grpc/shared';
import { Controller, UseFilters } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { Observable, ReplaySubject } from 'rxjs';

import {
  DownloadResponse,
  FileUploadServiceController,
  FileUploadServiceControllerMethods,
  UploadResponse,
} from '../assets/interfaces/file-upload.interface';
import { ChunkDto } from './dtos/chunk.dto';
import { DownloadDto } from './dtos/download.dto';
import { AppService } from './services/app.service';

@Controller()
@UseFilters(HttpToGrpcExceptionFilter)
@FileUploadServiceControllerMethods()
export class AppGrpcController
  implements Omit<FileUploadServiceController, 'download'>
{
  constructor(private readonly appService: AppService) {}

  upload(
    @Payload() chunk: Observable<ChunkDto>,
  ): Observable<UploadResponse> {
    const subject = new ReplaySubject<UploadResponse>(1);

    this.appService.upload(subject, chunk);

    return subject.asObservable();
  }

  async download(
    @Payload() { id }: DownloadDto,
  ): Promise<Observable<DownloadResponse>> {
    return await this.appService.download(id);
  }
}
