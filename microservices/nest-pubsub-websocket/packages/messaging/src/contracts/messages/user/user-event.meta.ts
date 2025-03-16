import { FleetEventMeta } from '../fleet/fleet-event.meta';
import { CustomerEventMeta } from '../customer/customer-event.meta';

export class UserEventMeta {
    id: string;
    email: string;
    name: string | null;
    groups: unknown[];
    assignedFleets: Omit<
        FleetEventMeta,
        'geoFence' | 'description'
    >[];
    customer: CustomerEventMeta | null;
}
