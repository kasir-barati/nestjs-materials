import { Module } from '@nestjs/common';

import { EventConsumer } from './event.consumer';

@Module({
  providers: [EventConsumer],
})
export class EventModule {}
