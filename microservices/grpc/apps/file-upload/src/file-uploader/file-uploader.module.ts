import { Module } from '@nestjs/common';

import { s3ClientFactory } from '../shared';
import { FileUploaderGrpcController } from './file-uploader.grpc-controller';
import { FileUploaderService } from './services/file-uploader.service';

@Module({
  providers: [FileUploaderService, s3ClientFactory],
  controllers: [FileUploaderGrpcController],
})
export class FileUploaderModule {}
