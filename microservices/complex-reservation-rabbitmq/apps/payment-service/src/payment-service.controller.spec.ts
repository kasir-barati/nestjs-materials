import {
  ChargeMicroservicesPayload,
  SinonMock,
  SinonMockType,
} from '@app/common';
import { PaymentServiceController } from './payment-service.controller';
import { PaymentServiceService } from './payment-service.service';

describe('PaymentServiceController', () => {
  let controller: PaymentServiceController;
  let service: SinonMockType<PaymentServiceService>;

  beforeEach(async () => {
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

    await controller.charge(data);

    expect(service.charge.calledWith(data)).toBeTruthy();
  });
});
