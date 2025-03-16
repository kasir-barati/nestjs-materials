import { EventTag, IEvent } from '../messages/event';

export abstract class IEventSkeletonMapper {
    abstract map(
        eventType: string,
        tags: EventTag[],
        traceId: string,
        tenantId: string | null,
        // FIXME: add user type here
        user: unknown,
        parentEventId: string | null,
    ): Omit<
        IEvent<any, any, any, any>,
        'preEventEntity' | 'postEventEntity'
    >;
}
