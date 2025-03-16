import { IEvent } from '../event';
import { EquipmentEventMeta } from './equipment-event.meta';

export class EquipmentDeletedEvent extends IEvent<
    'deleted',
    null,
    EquipmentEventMeta,
    2
> {}
