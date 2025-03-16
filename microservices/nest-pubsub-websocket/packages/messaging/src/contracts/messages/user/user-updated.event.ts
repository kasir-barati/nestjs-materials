import { IEvent } from '../event';
import { UserEventMeta } from './user-event.meta';

export class UserUpdatedEvent extends IEvent<
    'updated',
    UserEventMeta,
    UserEventMeta,
    1 | 2
> {}
