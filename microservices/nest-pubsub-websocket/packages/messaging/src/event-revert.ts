import { ClsService } from 'nestjs-cls';
import { EVENT_REVERT_CALLBACK } from './messaging.constant';

export const registerEventRevertForCls = (
    clsService: ClsService,
    eventRevertCallback: () => Promise<void>,
) => {
    const existingCallbacks =
        clsService.get(EVENT_REVERT_CALLBACK) || [];

    clsService.set(EVENT_REVERT_CALLBACK, [
        ...existingCallbacks,
        eventRevertCallback,
    ]);
};
