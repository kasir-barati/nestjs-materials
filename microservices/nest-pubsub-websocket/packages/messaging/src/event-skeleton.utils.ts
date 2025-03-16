import { IEvent } from './contracts/messages/event';
import { EventSkeleton } from './contracts/messages/event-skeleton.interface';

export function EventSkeletonFactory(): EventSkeleton {
    return {
        eventId: 'eventId',
        eventType: 'eventType',
        meta: {
            schemaVersion: 1,
        },
        tags: ['Fleet'],
        tenantId: 'tenantId',
        timestamp: new Date().toISOString(),
        traceId: 'traceId',
        user: {
            id: 'userId',
            email: 'userEmail',
            name: 'userName',
        },
        parentEventId: 'parentEventId',
    };
}

export function EventSkeletonMatcher(
    event: IEvent<any, any, any, any>,
    eventSkeleton: EventSkeleton,
): void {
    expect(event.eventId).toStrictEqual(eventSkeleton.eventId);
    expect(event.tags).toStrictEqual(eventSkeleton.tags);
    expect(event.traceId).toStrictEqual(eventSkeleton.traceId);
    expect(event.timestamp).toStrictEqual(eventSkeleton.timestamp);
    expect(event.eventType).toStrictEqual(eventSkeleton.eventType);
    expect(event.tenantId).toStrictEqual(eventSkeleton.tenantId);
    expect(event.user).toStrictEqual(eventSkeleton.user);
    expect(event.meta).toStrictEqual(eventSkeleton.meta);
}
