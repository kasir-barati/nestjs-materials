import { Module } from '@nestjs/common';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';
import { DriverController } from './driver.controller';
import { DriverSanitizer } from './driver.sanitizer';
import { DriverService } from './driver.service';
import { DriverRepositoryModule } from './repository/driver-repository.module';

@Module({
  imports: [RabbitmqModule, DriverRepositoryModule],
  controllers: [DriverController],
  providers: [DriverService, DriverSanitizer],
})
export class DriverModule {}
