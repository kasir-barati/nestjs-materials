import { DatabaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import {
  Verification,
  VerificationSchema,
} from '../entities/verification.entity';
import { VerificationRepository } from './verification.repository';

@Module({
  imports: [
    DatabaseModule.forFeature([
      {
        name: Verification.name,
        schema: VerificationSchema,
      },
    ]),
  ],
  providers: [VerificationRepository],
  exports: [VerificationRepository],
})
export class VerificationRepositoryModule {}
