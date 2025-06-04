import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { Post, PostSchema, User, UserSchema } from './schemas';
import { AppService, IndexService } from './services';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URI, {
      autoIndex: false,
      autoCreate: true,
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, IndexService],
})
export class AppModule {}
