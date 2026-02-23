import { Module } from '@nestjs/common';
import { RedisModule } from './redis';

@Module({
  imports: [
    RedisModule.registerAsync({
      global: true,
      useFactory: () => {
        return {
          redisUrl: process.env.REDIS_URL!,
          redisPassword: process.env.REDIS_PASSWORD,
        };
      },
    }),
  ],
})
export class AppModule {}
