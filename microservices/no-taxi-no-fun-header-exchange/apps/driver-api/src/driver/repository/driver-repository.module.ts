import { DatabaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import { Driver, DriverSchema } from '../entities/driver.entity';
import { DriverRepository } from './driver.repository';

@Module({
  imports: [
    DatabaseModule.forFeature([
      {
        name: Driver.name,
        schema: DriverSchema,
      },
    ]),
  ],
  providers: [DriverRepository],
  exports: [DriverRepository],
})
export class DriverRepositoryModule {}
