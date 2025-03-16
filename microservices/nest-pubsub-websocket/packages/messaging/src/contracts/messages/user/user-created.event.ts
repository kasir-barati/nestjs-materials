import { IEvent } from '../event';
import { UserEventMeta } from './user-event.meta';

export class UserCreatedEvent extends IEvent<
    'created',
    UserEventMeta,
    null,
    2
> {}
