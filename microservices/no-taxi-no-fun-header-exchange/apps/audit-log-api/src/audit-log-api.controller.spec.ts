import { AuditLogApiController } from './audit-log-api.controller';
import { AuditLogApiService } from './audit-log-api.service';

describe('AuditLogApiController', () => {
  let controller: AuditLogApiController;
  let service: AuditLogApiService;

  beforeEach(async () => {
    service = new AuditLogApiService();
    controller = new AuditLogApiController(service);
  });

  it('should return "Hello World!"', () => {
    expect(controller.getHello()).toBe('Hello World!');
  });
});
