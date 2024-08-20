import {
  DatabaseModule,
  LoggerModule,
  databaseConfig,
} from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import reservationServiceConfig from './configs/reservation-service.config';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [
    LoggerModule,
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath: [
        join(process.cwd(), '.env'),
        join(process.cwd(), 'apps', 'reservation-service', '.env'),
      ],
      load: [databaseConfig, reservationServiceConfig],
      isGlobal: true,
      cache: true,
    }),
    ReservationModule,
  ],
  controllers: [],
  providers: [],
})
export class ReservationServiceModule {}
