import { SinonMock } from 'testing';
import { EventTag } from '../contracts/messages/event';
import { EventSkeletonMapper } from './event-skeleton.mapper';

// FIXME: replace this with actual user type
interface TempUser {}

describe('EventSkeletonMapper', () => {
    let mapper: EventSkeletonMapper;

    beforeEach(() => {
        mapper = new EventSkeletonMapper();
    });

    it('map should generate unique event ID', () => {
        const result = mapper.map(
            'created',
            ['Fleet'],
            'traceId',
            null,
            SinonMock.with<TempUser>({}),
            null,
        );

        expect(result.eventId).toBeDefined();
    });

    it.each(['created', 'updated', 'deleted'])(
        'map should specify given event type',
        (eventType: string) => {
            const result = mapper.map(
                eventType,
                ['Fleet'],
                'traceId',
                null,
                SinonMock.with<TempUser>({}),
                null,
            );

            expect(result.eventType).toStrictEqual(eventType);
        },
    );

    it('map should specify schema version as 2 as default', () => {
        const result = mapper.map(
            'created',
            ['Fleet'],
            'traceId',
            null,
            SinonMock.with<TempUser>({}),
            null,
        );

        expect(result.meta).toStrictEqual({ schemaVersion: 2 });
    });

    it.each([[['Fleet', 'Asset']], [['Equipment']]])(
        'map should specify given tags',
        (tags: string[]) => {
            const result = mapper.map(
                'created',
                tags as EventTag[],
                'traceId',
                null,
                SinonMock.with<TempUser>({}),
                null,
            );

            expect(result.tags).toStrictEqual(tags);
        },
    );

    it.each(['traceId', 'anotherTraceId'])(
        'map should specify given trace ID',
        (traceId: string) => {
            const result = mapper.map(
                'created',
                ['Fleet'],
                traceId,
                null,
                SinonMock.with<TempUser>({}),
                null,
            );

            expect(result.traceId).toStrictEqual(traceId);
        },
    );

    it('map should specify timestamp as current time', () => {
        const result = mapper.map(
            'created',
            ['Fleet'],
            'traceId',
            null,
            SinonMock.with<TempUser>({}),
            null,
        );

        expect(result.timestamp).toBeDefined();
    });

    it.each(['tenantId', null])(
        'map should specify given tenant',
        (tenantId: string | null) => {
            const result = mapper.map(
                'created',
                ['Fleet'],
                'traceId',
                tenantId,
                SinonMock.with<TempUser>({}),
                null,
            );

            expect(result.tenantId).toStrictEqual(tenantId);
        },
    );

    it.each(['parentEventId', 'anotherParentEventId'])(
        'map should specify given parent event ID',
        (parentEventId: string) => {
            const result = mapper.map(
                'created',
                ['Fleet'],
                'traceId',
                null,
                SinonMock.with<TempUser>({}),
                parentEventId,
            );

            expect(result.parentEventId).toStrictEqual(parentEventId);
        },
    );

    it.each([
        ['userId', 'userEmail', 'userName'],
        ['anotherUserId', 'anotherUserEmail', 'anotherUserName'],
    ])(
        'map should specify expected user',
        (userId: string, userEmail: string, userName: string) => {
            const user: TempUser = {
                id: userId,
                email: userEmail,
                name: userName,
            };

            const result = mapper.map(
                'created',
                ['Fleet'],
                'traceId',
                null,
                user,
                null,
            );

            expect(result.user.id).toStrictEqual(userId);
            expect(result.user.email).toStrictEqual(userEmail);
            expect(result.user.name).toStrictEqual(userName);
        },
    );
});
