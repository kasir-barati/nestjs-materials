import { Injectable } from '@nestjs/common';
import { Subscription } from 'rxjs';
import { ISocketSubscriptionManager } from '../contracts/interfaces/socket-subscription-manager';

type SocketIdentifier = string;

@Injectable()
export class SocketSubscriptionManager
    implements ISocketSubscriptionManager
{
    private readonly subscriptions = new Map<
        SocketIdentifier,
        Subscription
    >();

    add(socketId: string, subscription: Subscription): void {
        this.subscriptions.set(socketId, subscription);
    }

    remove(socketId: string): void {
        const subscription = this.subscriptions.get(socketId);

        if (!subscription) {
            // We could throw an error here, right?
            return;
        }

        subscription.unsubscribe();
        this.subscriptions.delete(socketId);
    }
}
