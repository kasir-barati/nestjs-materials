import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

import { AppController } from './app.controller';
import appConfig from './configs/app.config';
import { MessagingModule } from './modules';

@Module({
  imports: [
    MessagingModule,
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
