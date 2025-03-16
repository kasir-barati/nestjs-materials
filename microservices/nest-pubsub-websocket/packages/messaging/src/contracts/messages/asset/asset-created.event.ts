import { AssetEventMeta } from './asset-event.meta';
import { IEvent } from '../event';

export class AssetCreatedEvent extends IEvent<
    'created',
    AssetEventMeta,
    null,
    2
> {}
