import { GeoFenceEventMeta } from '../geo-fence/geo-fence-event.meta';

export class FleetEventMeta {
    id: string;
    name: string;
    description: string | null;
    geoFence: GeoFenceEventMeta | null;
}
