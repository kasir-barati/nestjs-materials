import { AssetEventMeta } from './asset-event.meta';
import { IEvent } from '../event';

export class AssetDeletedEvent extends IEvent<
    'deleted',
    null,
    AssetEventMeta,
    2
> {}
