import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { Observable, ReplaySubject } from 'rxjs';
import {
  FileUploadServiceController,
  FileUploadServiceControllerMethods,
  UploadResponse,
} from '../assets/interfaces/file-upload.interface';
import { ChunkDto } from './dtos/chunk.dto';
import { AppService } from './services/app.service';

@Controller()
@FileUploadServiceControllerMethods()
export class AppGrpcController
  implements FileUploadServiceController
{
  constructor(private readonly appService: AppService) {}

  // TODO: Is this pipeline working?
  // @UsePipes(StreamValidationPipe)
  upload(
    @Payload() chunk: Observable<ChunkDto>,
  ): Observable<UploadResponse> {
    const subject = new ReplaySubject<UploadResponse>(1);

    // subject.next({});

    this.appService.upload(subject, chunk);

    return subject.asObservable();
  }
}
