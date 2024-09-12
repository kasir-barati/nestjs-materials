import { DatabaseModule, LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { DatabaseConfig } from './configs/database.config';
import verificationApiConfig from './configs/verification-api.config';
import { VerificationModule } from './verification/verification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [verificationApiConfig],
      cache: true,
      envFilePath: [
        join(process.cwd(), '.env'),
        join(process.cwd(), 'apps', 'verification-api', '.env'),
      ],
    }),
    DatabaseModule.forRootAsync({
      useClass: DatabaseConfig,
      imports: [ConfigModule.forFeature(verificationApiConfig)],
    }),
    VerificationModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class VerificationApiModule {}
