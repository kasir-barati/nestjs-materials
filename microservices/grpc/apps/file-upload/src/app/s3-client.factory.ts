import { S3Client } from '@aws-sdk/client-s3';
import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const s3ClientFactory: FactoryProvider<S3Client> = {
  provide: S3Client,
  inject: [ConfigService],
  useFactory(configService: ConfigService) {
    const s3Client = new S3Client({
      region: configService.get('appConfigs.REGION'),
      credentials: {
        accessKeyId: configService.get('appConfigs.ACCESS_KEY'),
        secretAccessKey: configService.get('appConfigs.SECRET_KEY'),
      },
    });

    return s3Client;
  },
};
