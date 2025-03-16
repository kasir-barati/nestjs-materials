import { CustomerEventMeta } from '../customer/customer-event.meta';
import { AssetEventMeta } from '../asset/asset-event.meta';

class EquipmentModelEventMeta {
    id: string;
    type: unknown;
    supplier: string;
    name: string;
}

export class EquipmentEventMeta {
    id: string;
    model: EquipmentModelEventMeta;
    name: string;
    customer: CustomerEventMeta | null;
    imei: string | null;
    asset: Omit<AssetEventMeta, 'customer'> | null;
}
