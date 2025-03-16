import { EquipmentEventMeta } from './equipment-event.meta';
import { IEvent } from '../event';

export class EquipmentCreatedEvent extends IEvent<
    'created',
    EquipmentEventMeta /* equipment after creation */,
    null /* equipment before creation */,
    2
> {}
