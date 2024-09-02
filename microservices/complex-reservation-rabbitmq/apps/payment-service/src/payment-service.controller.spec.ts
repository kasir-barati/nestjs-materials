import { ChargeMicroservicesPayload } from '@app/common';
import { SinonMock, SinonMockType } from '@app/testing';
import { RmqContext } from '@nestjs/microservices';
import { PaymentServiceController } from './payment-service.controller';
import { PaymentServiceService } from './payment-service.service';

describe('PaymentServiceController', () => {
  let controller: PaymentServiceController;
  let service: SinonMockType<PaymentServiceService>;
  let rmqContext: SinonMockType<RmqContext>;

  beforeEach(async () => {
    rmqContext = SinonMock.with<RmqContext>({});
    service = SinonMock.of(PaymentServiceService);
    controller = new PaymentServiceController(service);
  });

  it.each<ChargeMicroservicesPayload>([
    {
      amount: 1000,
      token: 'tok_abc',
    },
    {
      amount: 9000,
      token: 'tok_cdb',
    },
  ])('should charge', async (data) => {
    service.charge.resolves();
    rmqContext.getChannelRef.returns('channel');
    rmqContext.getMessage.returns('message');

    await controller.charge(data, rmqContext);

    expect(
      service.charge.calledWith({
        payload: data,
        channel: 'channel',
        message: 'message',
      }),
    ).toBeTruthy();
  });
});
