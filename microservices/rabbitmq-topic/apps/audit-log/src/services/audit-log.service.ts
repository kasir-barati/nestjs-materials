import { Injectable } from '@nestjs/common';
import { LogRepository } from './log-repository.service';

@Injectable()
export class AuditLogService {
  constructor(private readonly logRepository: LogRepository) {}

  read() {
    return this.logRepository.read({}, { page: 1, limit: 10 });
  }
}
