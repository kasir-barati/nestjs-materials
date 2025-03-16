import { IEvent } from '../event';
import { FleetEventMeta } from './fleet-event.meta';

export class FleetUpdatedEvent extends IEvent<
    'updated',
    FleetEventMeta,
    FleetEventMeta,
    2
> {}
