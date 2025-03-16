import { EquipmentEventMeta } from './equipment-event.meta';
import { IEvent } from '../event';

// This event is produced when equipment is updated, assigned or unassigned.
export class EquipmentUpdatedEvent extends IEvent<
    'updated',
    EquipmentEventMeta,
    EquipmentEventMeta,
    2
> {}
