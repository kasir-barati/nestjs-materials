import { Module } from '@nestjs/common';

import { EventConsumer } from './event.consumer';
import { EventService } from './event.service';

@Module({
  providers: [EventConsumer, EventService],
})
export class EventModule {}
