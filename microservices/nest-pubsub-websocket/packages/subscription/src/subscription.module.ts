import { Module } from '@nestjs/common';
import { Bus } from '@rxfx/bus';
import { getBus } from './configs/get-bus.config';
import { ISocketSubscriptionManager } from './contracts/interfaces/socket-subscription-manager';
import { SocketSubscriptionManager } from './providers/socket-subscription-manager.provider';

@Module({
    providers: [
        {
            provide: ISocketSubscriptionManager,
            useClass: SocketSubscriptionManager,
        },
        {
            provide: Bus,
            useFactory: getBus,
        },
    ],
    exports: [ISocketSubscriptionManager, Bus],
})
export class SubscriptionModule {}
