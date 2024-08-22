import { LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import paymentServiceConfig from './configs/payment-service.config';
import { stripeFactory } from './configs/stripe.config';
import { PaymentServiceController } from './payment-service.controller';
import { PaymentServiceService } from './payment-service.service';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [paymentServiceConfig],
      envFilePath: [
        join(process.cwd(), '.env'),
        join(process.cwd(), 'apps', 'payment-service', '.env'),
      ],
    }),
  ],
  controllers: [PaymentServiceController],
  providers: [PaymentServiceService, stripeFactory],
})
export class PaymentServiceModule {}
