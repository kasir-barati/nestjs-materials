import type { Queue } from 'bull';

import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';

import { CorrelationIdService } from '../libs/shared';
import { APP_JOB, APP_QUEUE } from './app.constant';
import { Message } from './types/jobs.type';

@Injectable()
export class AppService {
  constructor(
    @InjectQueue(APP_QUEUE)
    private readonly appQueue: Queue<Message>,
    private correlationIdService: CorrelationIdService,
  ) {}

  async getHello(): Promise<string> {
    await this.appQueue.add(
      APP_JOB,
      {
        message: 'Hello world!',
        correlationId: this.correlationIdService.correlationId,
      },
      { jobId: Math.ceil(Math.random() * 1_000) },
    );

    return 'Hello World!';
  }
}
