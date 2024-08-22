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
      card: {
        cvc: '737',
        expMonth: 5,
        expYear: 2026,
        number: '374245455400122',
      },
    },
    {
      amount: 9000,
      card: {
        cvc: '737',
        expMonth: 10,
        expYear: 2030,
        number: '8171999927660000',
      },
    },
  ])('should charge', async (data) => {
    service.charge.resolves();

    await controller.charge(data);

    expect(service.charge.calledWith(data)).toBeTruthy();
  });
});
