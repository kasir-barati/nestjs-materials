import { OnQueueEvent, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ClsService, UseCls } from 'nestjs-cls';
import { CORRELATION_ID_CLS_KEY } from '../libs/shared';

import { APP_JOB, APP_QUEUE } from './app.constant';
import { Message } from './types/jobs.type';

@Processor(APP_QUEUE)
export class AppProcessor {
  private readonly logger = new Logger(AppProcessor.name);

  constructor(private readonly cls: ClsService) {}

  @OnQueueEvent('failed')
  @UseCls({
    setup(cls, job, _error) {
      cls.set(CORRELATION_ID_CLS_KEY, job.data.correlationId);
    },
  })
  async failedEventHandler(job: Job<Message>, error: Error) {
    this.logger.error(
      JSON.stringify(job) + ' failed: ' + JSON.stringify(error),
    );
    // ... or Send an email to somebody.
  }

  @Process(APP_JOB)
  @UseCls({
    setup(cls, job) {
      cls.set(CORRELATION_ID_CLS_KEY, job.data.correlationId);
    },
  })
  async process(job: Job<Message>) {
    await new Promise((resolve) => {
      setTimeout(() => {
        this.logger.log(`Job #${job.id} processed`);

        resolve(undefined);
      }, 5000);
    });
  }
}
