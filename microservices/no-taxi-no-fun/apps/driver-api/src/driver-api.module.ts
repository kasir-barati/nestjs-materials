import { DatabaseModule, LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { DatabaseConfig } from './configs/database.config';
import driverApiConfig from './configs/driver-api.config';
import { DriverModule } from './driver/driver.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        join(process.cwd(), '.env'),
        join(process.cwd(), 'apps', 'driver-api', '.env'),
      ],
      load: [driverApiConfig],
      isGlobal: true,
      cache: true,
    }),
    DatabaseModule.forRootAsync({
      useClass: DatabaseConfig,
      imports: [ConfigModule.forFeature(driverApiConfig)],
    }),
    DriverModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class DriverApiModule {}
