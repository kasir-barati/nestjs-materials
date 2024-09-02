import { SinonMock, SinonMockType } from '@app/testing';
import { Model } from 'mongoose';
import { FailedEmail } from '../entities/failed-email.entity';
import { FailedEmailRepository } from './failed-email.repository';

describe('FailedEmailRepository', () => {
  let repository: FailedEmailRepository;
  let model: SinonMockType<Model<FailedEmail>>;

  beforeEach(() => {
    model = SinonMock.of(Model<FailedEmail>);
    repository = new FailedEmailRepository(model);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
