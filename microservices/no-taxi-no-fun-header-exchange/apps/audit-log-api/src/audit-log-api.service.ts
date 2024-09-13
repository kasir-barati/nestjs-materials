import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditLogApiService {
  getHello(): string {
    return 'Hello World!';
  }
}
