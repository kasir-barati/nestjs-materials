import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { join } from 'path';

import { AppController } from './app.controller';
import { appConfigs } from './configs';
import { EventModule, LoggerModule, MessagingModule } from './modules';

@Module({
  imports: [
    LoggerModule,
    MessagingModule,
    EventModule,
    ConfigModule.forRoot({
      load: [appConfigs],
      cache: true,
      isGlobal: true,
      envFilePath: [join(process.cwd(), '.env')],
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
