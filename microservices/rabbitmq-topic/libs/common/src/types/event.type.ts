import {
  IsISO8601,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Retry } from './retry.type';

export class Event<BeforeEvent, AfterEvent> extends Retry {
  @IsUUID()
  requestId: string;

  @IsString({ each: true })
  tags: string[];

  @IsString()
  eventType: string;

  // Can be MongoId, or UUID. Depends on the underlying technologies used for auth.
  @IsString()
  userId: string;

  @IsOptional()
  @IsObject()
  beforeEvent: BeforeEvent;

  @IsOptional()
  @IsObject()
  afterEvent: AfterEvent;

  @IsISO8601()
  timestamp: string;
}
