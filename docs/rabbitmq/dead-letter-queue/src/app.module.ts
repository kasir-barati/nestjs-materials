import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

import { AppController } from './app.controller';
import appConfig from './configs/app.config';
import { DriverVerificationReqResModule } from './driver-verification-req-res/driver-verification-req-res.module';
import { DriverVerificationModule } from './driver-verification/driver-verification.module';

@Module({
  imports: [
    DriverVerificationModule,
    DriverVerificationReqResModule,
    ConfigModule.forRoot({
      load: [appConfig],
      cache: true,
      isGlobal: true,
      envFilePath: [join(process.cwd(), '.env')],
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
