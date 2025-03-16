import { IEvent } from '../event';
import { AssignedFleetMeta } from '../fleet/assigned-fleet.meta';

export class CustomerAssetEventMeta {
    id: string;
    name: string;
    assignedFleet: AssignedFleetMeta | null;
}

export class CustomerAssetUpdatedEvent extends IEvent<
    'updated',
    CustomerAssetEventMeta,
    CustomerAssetEventMeta,
    2
> {}
