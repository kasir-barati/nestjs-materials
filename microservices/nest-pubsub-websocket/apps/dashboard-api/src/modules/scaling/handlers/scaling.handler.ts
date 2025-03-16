import {
    Injectable,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';
import { Bus } from '@rxfx/bus';
import { DashboardEvent } from 'common';
import { IPushManager } from 'push';
import { IScalingHandler } from '../contracts/handlers/scaling.handler';

@Injectable()
export class ScalingHandler
    implements OnModuleInit, OnModuleDestroy, IScalingHandler
{
    constructor(
        private readonly pushScaleManager: IPushManager<DashboardEvent>,
        private readonly bus: Bus<DashboardEvent>,
    ) {}

    async onModuleDestroy(): Promise<void> {
        await this.pushScaleManager.disconnect();
    }

    async onModuleInit(): Promise<void> {
        await this.pushScaleManager.onMessage((message) =>
            this.bus.trigger(message),
        );
    }

    async broadcast(event: DashboardEvent): Promise<void> {
        try {
            await this.pushScaleManager.broadcastForReplicas(event);
        } catch (e) {
            console.log(e);
        }
    }
}
