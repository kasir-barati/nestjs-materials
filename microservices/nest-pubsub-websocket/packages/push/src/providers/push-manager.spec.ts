import {
    ISinonMock,
    SinonMock,
} from 'backend/libs/testing/mock/sinon';
import { RedisClientType } from 'redis';
import { match, stub } from 'sinon';
import { PushManager } from './push-manager';

describe('PushManager', () => {
    let redisClient: ISinonMock<RedisClientType>;
    let duplicate: ISinonMock<RedisClientType>;
    const channel = 'channel';
    let manager: PushManager<TestEvent>;

    beforeEach(() => {
        redisClient = SinonMock.with<RedisClientType>({});
        duplicate = SinonMock.with<RedisClientType>({});
        redisClient.duplicate.returns(duplicate);
        manager = new PushManager(redisClient, channel);
    });

    it('broadcastForReplicas should publish event to redis', async () => {
        const event = new TestEvent();

        await manager.broadcastForReplicas(event);

        expect(duplicate.publish).toHaveBeenCalledWith(
            channel,
            JSON.stringify(event),
        );
    });

    it('disconnect should disconnect redis client', async () => {
        await manager.disconnect();

        expect(redisClient.disconnect).toHaveBeenCalled();
        expect(duplicate.disconnect).toHaveBeenCalled();
    });

    it('onModuleInit should connect to duplicated redis client', async () => {
        manager = new PushManager(redisClient, channel);

        await manager.onModuleInit();

        expect(redisClient.duplicate).toHaveBeenCalled();
        expect(duplicate.connect).toHaveBeenCalled();
    });

    it('onMessage should subscribe to the given channel and call the given callback', async () => {
        const callback = stub();
        const message = JSON.stringify({ some: 'message' });
        redisClient.subscribe.yields(message);

        await manager.onMessage(callback);

        expect(redisClient.subscribe).toHaveBeenCalledWith(
            channel,
            match.func,
        );
        expect(callback).toHaveBeenCalledWith(JSON.parse(message));
    });
});

class TestEvent {}
