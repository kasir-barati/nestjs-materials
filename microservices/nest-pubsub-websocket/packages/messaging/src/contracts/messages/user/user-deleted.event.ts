import { IEvent } from '../event';
import { UserEventMeta } from './user-event.meta';

export class UserDeletedEvent extends IEvent<
    'deleted',
    null,
    UserEventMeta,
    2
> {}
