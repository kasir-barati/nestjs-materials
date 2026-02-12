import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  CorruptedEvent,
  CorruptedEventDocument,
} from './corrupted-events.schema';

@Injectable()
export class EventRepository {
  constructor(
    @InjectModel(CorruptedEvent.name)
    private readonly corruptedEventModel: Model<CorruptedEventDocument>,
  ) {}

  async storeCorruptedEvent(event: CorruptedEvent) {
    const createdEvent = await this.corruptedEventModel.create(event);

    return createdEvent.toJSON();
  }
}
