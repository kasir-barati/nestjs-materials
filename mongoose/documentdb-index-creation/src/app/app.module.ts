import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from '../user';
import { AppController } from './app.controller';
import { Post, PostSchema } from './schemas';
import { AppService, IndexService } from './services';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URI, {
      autoIndex: false,
      autoCreate: true,
    }),
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
    ]),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, IndexService],
})
export class AppModule {}
