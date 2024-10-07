import { SinonMock, SinonMockType } from '@app/testing';
import { VerificationController } from './verification.controller';
import { VerificationSanitizer } from './verification.sanitizer';
import { VerificationService } from './verification.service';

describe('VerificationController', () => {
  let controller: VerificationController;
  let service: SinonMockType<VerificationService>;
  let sanitizer: SinonMockType<VerificationSanitizer>;

  beforeEach(async () => {
    service = SinonMock.of(VerificationService);
    controller = new VerificationController(service, sanitizer);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
