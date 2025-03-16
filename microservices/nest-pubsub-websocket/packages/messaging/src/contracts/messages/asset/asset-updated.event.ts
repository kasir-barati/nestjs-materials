import { IEvent } from '../event';
import { AssetEventMeta } from './asset-event.meta';

export class AssetUpdatedEvent extends IEvent<
    'updated',
    AssetEventMeta,
    AssetEventMeta,
    2
> {}
