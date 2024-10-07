import { Injectable } from '@nestjs/common';
import { VerificationRepository } from './repository/verification.repository';

@Injectable()
export class VerificationService {
  constructor(
    private readonly verificationRepository: VerificationRepository,
  ) {}

  read() {
    return this.verificationRepository.read(
      {},
      { page: 1, limit: 10 },
    );
  }
}
