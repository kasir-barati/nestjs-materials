import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const s3ClientFactory: FactoryProvider<S3Client> = {
  provide: S3Client,
  inject: [ConfigService],
  useFactory(configService: ConfigService) {
    const accessKeyId = configService.get(
      'appConfigs.OBJECT_STORAGE_ACCESS_KEY',
    );
    const endpoint = configService.get(
      'appConfigs.OBJECT_STORAGE_ENDPOINT',
    );
    const secretAccessKey = configService.get(
      'appConfigs.OBJECT_STORAGE_SECRET_KEY',
    );
    const configs: S3ClientConfig = {
      region: configService.get('appConfigs.OBJECT_STORAGE_REGION'),
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      logger: console,
    };

    if (endpoint) {
      configs.endpoint = endpoint;
      configs.forcePathStyle = true;
    }

    const s3Client = new S3Client(configs);

    return s3Client;
  },
};
