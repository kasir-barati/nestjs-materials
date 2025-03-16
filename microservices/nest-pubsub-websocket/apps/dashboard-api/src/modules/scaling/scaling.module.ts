import { Module } from '@nestjs/common';
import { PushModule } from 'push';
import { SubscriptionModule } from 'subscription';
import { IScalingHandler } from './contracts/handlers/scaling.handler';
import { ScalingHandler } from './handlers/scaling.handler';

@Module({
    imports: [
        PushModule.forRoot({
            channel: 'm2',
        }),
        SubscriptionModule,
    ],
    providers: [
        {
            provide: IScalingHandler,
            useClass: ScalingHandler,
        },
    ],
    exports: [IScalingHandler],
})
export class ScalingModule {}
