import { SinonMock } from '@app/testing';
import { AuditLogController } from './audit-log.controller';

describe('AuditLogController', () => {
  let controller: AuditLogController;

  beforeEach(async () => {
    controller = SinonMock.of(AuditLogController);
  });

  it('should be true', () => {
    expect(true).toBe(true);
  });
});
