import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseConfig } from './configs';
import { schemaFactories } from './schema.factory';

@Module({
  imports: [
    MongooseModule.forRootAsync({ useClass: MongooseConfig }),
    MongooseModule.forFeatureAsync(schemaFactories),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
