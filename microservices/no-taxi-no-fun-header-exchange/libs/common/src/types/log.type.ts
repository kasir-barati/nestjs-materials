import {
  IsDateString,
  IsMongoId,
  IsObject,
  IsString,
  IsUUID,
} from 'class-validator';

export class LogPayload {
  @IsUUID()
  requestId: string;

  @IsString({ each: true })
  tags?: string[];

  @IsString()
  eventType: string;

  @IsMongoId()
  userId: string;

  @IsObject()
  event: Record<string, unknown>;

  @IsDateString()
  timestamp: string;
}
