import { Injectable } from '@nestjs/common';
import { LogRepository } from './repository/log.repository';

@Injectable()
export class AuditLogService {
  constructor(private readonly logRepository: LogRepository) {}

  read() {
    return this.logRepository.read({}, { page: 1, limit: 10 });
  }
}
