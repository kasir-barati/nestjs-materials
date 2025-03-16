import { ActivityTracked } from '@rxfx/bus';
import { Subscription } from 'rxjs';

export abstract class ISocketSubscriptionManager {
    abstract add(
        socketId: string,
        subscription: Subscription & ActivityTracked,
    ): void;

    abstract remove(socketId: string): void;
}
