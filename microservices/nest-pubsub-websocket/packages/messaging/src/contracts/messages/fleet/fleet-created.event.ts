import { IEvent } from '../event';
import { FleetEventMeta } from './fleet-event.meta';

export class FleetCreatedEvent extends IEvent<
    'created',
    FleetEventMeta /* fleet after creation */,
    null,
    2
> {}

/**
 * Example for a schema version 2:
 *
 * export class FleetCreatedEventV2 extends IEvent<
 *   "updated",
 *   FleetEventMeta & { userIds: string[] },
 *   FleetEventMeta & { userIds: string[] },
 *   2
 * > {}
 **/
