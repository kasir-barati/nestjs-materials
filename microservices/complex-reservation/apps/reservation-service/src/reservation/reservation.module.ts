import {
  AUTH_SERVICE,
  DatabaseModule,
  NOTIFICATION_SERVICE,
  PAYMENT_SERVICE,
} from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { AuthClientsModuleConfig } from '../configs/auth-client-module.config';
import { NotificationClientsModuleConfig } from '../configs/notification-client-module.config';
import { PaymentClientsModuleConfig } from '../configs/payment-client-module.config';
import reservationServiceConfig from '../configs/reservation-service.config';
import {
  Reservation,
  ReservationSchema,
} from './entities/reservation.entity';
import { ReservationController } from './reservation.controller';
import { ReservationRepository } from './reservation.repository';
import { ReservationService } from './reservation.service';

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        imports: [ConfigModule.forFeature(reservationServiceConfig)],
        useClass: AuthClientsModuleConfig,
      },
      {
        name: PAYMENT_SERVICE,
        imports: [ConfigModule.forFeature(reservationServiceConfig)],
        useClass: PaymentClientsModuleConfig,
      },
      {
        name: NOTIFICATION_SERVICE,
        imports: [ConfigModule.forFeature(reservationServiceConfig)],
        useClass: NotificationClientsModuleConfig,
      },
    ]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationRepository],
})
export class ReservationModule {}
