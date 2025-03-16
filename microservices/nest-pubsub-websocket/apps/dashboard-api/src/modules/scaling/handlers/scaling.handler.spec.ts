import { Bus } from '@rxfx/bus';
import { DashboardEvent } from 'common';
import { IPushManager } from 'push';
import { ISinonMock, SinonMock } from 'testing';
import { ScalingHandler } from './scaling.handler';

describe('ScalingHandler', () => {
    let pushScaleManager: ISinonMock<IPushManager<DashboardEvent>>;
    let bus: ISinonMock<Bus<DashboardEvent>>;

    let handler: ScalingHandler;

    beforeEach(() => {
        pushScaleManager = SinonMock.with<
            IPushManager<DashboardEvent>
        >({});
        bus = SinonMock.with<Bus<DashboardEvent>>({});

        handler = new ScalingHandler(pushScaleManager, bus);
    });

    it('onModuleInit should add listener for delegating messages to event bus', async () => {
        const event = new DashboardEvent();
        pushScaleManager.onMessage.yieldsRight(event);

        await handler.onModuleInit();

        expect(bus.trigger).toHaveBeenCalledWith(event);
    });

    it('onModuleDestroy should disconnect push scaling manager', async () => {
        await handler.onModuleDestroy();

        expect(pushScaleManager.disconnect).toHaveBeenCalled();
    });

    it('broadcast should broadcast event to push scaling manager', async () => {
        const event = new DashboardEvent();

        await handler.broadcast(event);

        expect(
            pushScaleManager.broadcastForReplicas,
        ).toHaveBeenCalledWith(event);
    });
});
