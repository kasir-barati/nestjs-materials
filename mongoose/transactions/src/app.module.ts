import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import appConfig from './configs/app.config';
import { DatabaseConfig } from './configs/database.config';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './logger/logger.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [join(process.cwd(), '.env')],
      load: [appConfig],
      isGlobal: true,
      cache: true,
    }),
    DatabaseModule.forRootAsync({
      useClass: DatabaseConfig,
      imports: [ConfigModule.forFeature(appConfig)],
    }),
    ProductModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
