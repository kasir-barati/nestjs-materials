import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  CorruptedEvent,
  CorruptedEventSchema,
} from './corrupted-events.schema';
import { EventConsumer } from './event.consumer';
import { EventRepository } from './event.repository';
import { EventService } from './event.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CorruptedEvent.name,
        schema: CorruptedEventSchema,
        collection: 'corrupted_events',
      },
    ]),
  ],
  providers: [EventConsumer, EventService, EventRepository],
})
export class EventModule {}
