export class EventUser {
    id: string;
    email: string;
    name: string | null;
}

export class EventMeta<Version> {
    schemaVersion: Version;
}

export type EventTag =
    | 'Fleet'
    | 'Asset'
    | 'Customer'
    | 'Equipment'
    | 'User'
    | 'CustomerAsset';

export abstract class IEvent<
    Type extends string,
    PostEventEntity,
    PreEventEntity,
    Version extends 1 | 2,
> {
    // Meta information about the schema of the event
    meta: EventMeta<Version>;

    // Tags for the event (e.g. involved entities)
    tags: EventTag[];

    // Type of the event
    eventType: Type;

    // User who initiated the event
    user: EventUser;

    // ID of the tenant where the event was initiated
    tenantId: string | null;

    // Entity after the event was initiated
    postEventEntity: PostEventEntity;

    // Entity before the event was initiated
    preEventEntity: PreEventEntity;

    // Timestamp when the event was initiated
    timestamp: string;

    // Unique ID of request where the event was initiated
    traceId: string;

    // Unique ID of the event
    eventId: string;

    // Unique ID of the parent event
    parentEventId: string | null;
}
