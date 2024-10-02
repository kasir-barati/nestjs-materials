import { ApiProperty } from '@nestjs/swagger';

export class ReadLogDto {
  @ApiProperty({
    type: String,
    example: '66f3f0e12a4ac3cd04e82cf3',
    description: 'Mongo ID',
  })
  _id: string;

  @ApiProperty({
    type: String,
    example: 'c4efa935-80ea-4a62-b176-12073855ec7e',
    description:
      'Request ID of this event. You can sort same requestId events by timestamp to see what happened in what order.',
  })
  requestId: string;

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'Tags of this event.',
    example: ['auth', 'login'],
  })
  tags: string[];

  @ApiProperty({
    type: String,
    example: 'info',
    description: 'Type of event.',
  })
  eventType: string;

  @ApiProperty({
    type: String,
    description:
      'User ID. Can be ObjectId or UUID depends on the implementation and whether we are using something like FusionAuth or not.',
  })
  userId: string;

  @ApiProperty({
    type: Object,
    required: false,
    description: 'How resource looked like after event.',
  })
  afterEvent: Record<string, unknown> | undefined;

  @ApiProperty({
    type: Object,
    required: false,
    description: 'How the resource looked like before event.',
  })
  beforeEvent: Record<string, unknown> | undefined;

  @ApiProperty({
    type: String,
    example: '2024-09-25T11:24:12.563Z',
    description: 'When this event was published.',
  })
  timestamp: Date;

  @ApiProperty({
    type: String,
    example: '2024-09-25T11:24:52.563Z',
    description: 'When this event was created.',
  })
  createdAt: string;
}
