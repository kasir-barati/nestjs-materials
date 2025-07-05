import { CorrelationIdModule } from '@grpc/modules';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { s3ClientFactory } from '../shared';
import { AppGrpcController } from './app.grpc-controller';
import appConfigs from './configs/app.config';
import { FileRepository } from './repositories/file.repository';
import { AppService } from './services/app.service';

@Module({
  imports: [
    CorrelationIdModule,
    ConfigModule.forRoot({ load: [appConfigs], cache: true }),
  ],
  controllers: [AppGrpcController],
  providers: [AppService, s3ClientFactory, FileRepository],
})
export class AppModule {}
