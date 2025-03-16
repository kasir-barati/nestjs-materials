import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IEventSkeletonMapper } from '../contracts/interfaces/event-skeleton-mapper.interface';
import { EventTag } from '../contracts/messages/event';
import { EventSkeleton } from '../contracts/messages/event-skeleton.interface';

@Injectable()
export class EventSkeletonMapper implements IEventSkeletonMapper {
    map(
        eventType: string,
        tags: EventTag[],
        traceId: string,
        tenantId: string | null,
        // FIXME: add user type here, then fix lines 29 to 31
        user: object,
        parentEventId: string | null,
    ): EventSkeleton {
        return {
            eventId: randomUUID(),
            eventType,
            meta: {
                schemaVersion: 2,
            },
            tags,
            tenantId,
            timestamp: new Date().toISOString(),
            traceId,
            user: {
                id: user['id'],
                email: user['email'],
                name: user['name'],
            },
            parentEventId,
        };
    }
}
