import { SinonMock, SinonMockType } from '@app/testing';
import { Model } from 'mongoose';
import { Verification } from '../entities/verification.entity';
import { VerificationRepository } from './verification.repository';

describe('VerificationRepository', () => {
  let repository: VerificationRepository;
  let model: SinonMockType<Model<Verification>>;

  beforeEach(() => {
    model = SinonMock.of(Model<Verification>);
    repository = new VerificationRepository(model);
  });

  it('should work', async () => {
    expect(repository).toBeUndefined();
  });
});
