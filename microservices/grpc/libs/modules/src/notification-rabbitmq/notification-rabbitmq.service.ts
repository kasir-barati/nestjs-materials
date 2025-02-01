import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationRabbitmqService {
  private readonly logger = new Logger(NotificationRabbitmqService.name);
}
