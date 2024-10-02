export interface KafkaEvent<BeforeEvent, AfterEvent> {
  requestId: string;
  tags: string[];
  eventType: string;
  userId: string;
  beforeEvent: BeforeEvent;
  afterEvent: AfterEvent;
  timestamp: string;
}
