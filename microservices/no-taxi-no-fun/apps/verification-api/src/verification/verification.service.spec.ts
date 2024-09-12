import { SinonMock, SinonMockType } from '@app/testing';
import { VerificationRepository } from './repository/verification.repository';
import { VerificationService } from './verification.service';

describe('VerificationService', () => {
  let service: VerificationService;
  let repository: SinonMockType<VerificationRepository>;

  beforeEach(async () => {
    repository = SinonMock.of(VerificationRepository);
    service = new VerificationService(repository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
