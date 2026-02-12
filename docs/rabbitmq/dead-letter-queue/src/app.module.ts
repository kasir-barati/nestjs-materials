import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { join } from 'path';

import { AppController } from './app.controller';
import { appConfigs, MongooseModuleConfig } from './configs';
import { EventModule, LoggerModule, MessagingModule } from './modules';

@Module({
  imports: [
    LoggerModule,
    MessagingModule,
    HttpModule.register({ global: true }),
    EventModule,
    ConfigModule.forRoot({
      load: [appConfigs],
      cache: true,
      isGlobal: true,
      envFilePath: [join(process.cwd(), '.env')],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useClass: MongooseModuleConfig,
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'APP_LOGGER',
      useExisting: WINSTON_MODULE_NEST_PROVIDER,
    },
  ],
})
export class AppModule {}
