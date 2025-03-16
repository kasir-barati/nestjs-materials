import { FleetEventMeta } from './fleet-event.meta';
import { IEvent } from '../event';

export class FleetDeletedEvent extends IEvent<
    'deleted',
    null,
    FleetEventMeta,
    2
> {}
