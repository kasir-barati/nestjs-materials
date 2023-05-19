import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import authConfig from './auth.config';

@Module({
  imports: [ConfigModule.forFeature(authConfig)],
  controllers: [AuthController],
})
export class AuthModule {}
