import {
  containsNull,
  DIRECT_EXCHANGE,
  DRIVER_VERIFICATION_REQ_QUEUE,
  DriverVerificationRequestPayload,
  NullFieldError,
} from '@app/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { CreateOrUpdateDriverDto } from './dto/create-or-update-driver.dto';
import { Driver } from './entities/driver.entity';
import { DriverRepository } from './repository/driver.repository';

@Injectable()
export class DriverService {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async createOrUpdate(
    id: string,
    createOrUpdateDriverDto: CreateOrUpdateDriverDto,
  ): Promise<{
    status: 'created' | 'updated';
    data: Driver;
  }> {
    const session = await this.driverRepository.startSession();
    session.startTransaction();

    try {
      const driver = await this.driverRepository.findOne(
        { _id: id },
        { session },
      );

      if (driver) {
        this.validateBeforeCreateOrUpdate(createOrUpdateDriverDto);

        const data = await this.driverRepository.patch(
          id,
          createOrUpdateDriverDto,
          session,
        );

        await session.commitTransaction();
        await session.endSession();

        return {
          status: 'updated',
          data,
        };
      }

      this.validateBeforeCreateOrUpdate(createOrUpdateDriverDto);

      const data = await this.driverRepository.create(
        {
          _id: id,
          ...(createOrUpdateDriverDto as unknown as Driver),
        },
        {
          session,
        },
      );

      await this.amqpConnection.publish<DriverVerificationRequestPayload>(
        DIRECT_EXCHANGE,
        DRIVER_VERIFICATION_REQ_QUEUE,
        {
          driverId: id,
        },
      );
      await session.commitTransaction();
      await session.endSession();

      return {
        status: 'created',
        data,
      };
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw error;
    }
  }

  findById(id: string) {
    return this.driverRepository.findById(id);
  }

  private validateBeforeCreateOrUpdate(
    createOrUpdateDriverDto: CreateOrUpdateDriverDto,
  ) {
    const { birthday, ...rest } = createOrUpdateDriverDto;

    const nullValidationResult = containsNull(rest);
    if (nullValidationResult.result) {
      throw new NullFieldError(nullValidationResult.field);
    }
  }
}
