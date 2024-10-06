import { Module } from '@nestjs/common';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';
import { VerificationRepositoryModule } from './repository/verification-repository.module';
import { VerificationController } from './verification.controller';
import { VerificationSanitizer } from './verification.sanitizer';
import { VerificationService } from './verification.service';

@Module({
  imports: [RabbitmqModule, VerificationRepositoryModule],
  controllers: [VerificationController],
  providers: [VerificationService, VerificationSanitizer],
})
export class VerificationModule {}
