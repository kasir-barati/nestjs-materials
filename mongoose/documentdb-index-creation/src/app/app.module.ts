import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Post, PostSchema, User, UserSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URI, {
      autoIndex: true,
      autoCreate: true,
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
