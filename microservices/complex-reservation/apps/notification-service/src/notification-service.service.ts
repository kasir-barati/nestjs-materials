import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
