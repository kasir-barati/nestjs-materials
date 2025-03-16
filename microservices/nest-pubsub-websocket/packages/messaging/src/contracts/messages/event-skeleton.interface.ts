import { IEvent } from './event';

export type EventSkeleton = Omit<
    IEvent<any, any, any, any>,
    'preEventEntity' | 'postEventEntity'
>;
