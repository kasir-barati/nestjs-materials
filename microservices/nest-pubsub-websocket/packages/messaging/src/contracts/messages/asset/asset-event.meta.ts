import { CustomerEventMeta } from '../customer/customer-event.meta';

export class AssetEventMeta {
    id: string;
    type: unknown;
    rytleInternalNumber: string;
    customer: CustomerEventMeta | null;
}
