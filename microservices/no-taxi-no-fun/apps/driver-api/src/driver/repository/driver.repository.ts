import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ClientSession,
  FilterQuery,
  Model,
  QueryOptions,
} from 'mongoose';
import { CreateOrUpdateDriverDto } from '../dto/create-or-update-driver.dto';
import { Driver } from '../entities/driver.entity';

@Injectable()
export class DriverRepository extends AbstractRepository<Driver> {
  protected readonly logger = new Logger(DriverRepository.name);

  constructor(
    @InjectModel(Driver.name)
    protected readonly model: Model<Driver>,
  ) {
    super(model);
  }

  async findOne(
    filterQuery: FilterQuery<Driver>,
    queryOptions?: QueryOptions<Driver>,
  ): Promise<Driver | undefined> {
    const reservation = await this.model.findOne(
      filterQuery,
      null,
      queryOptions,
    );

    if (!reservation) {
      return;
    }

    return reservation.toObject();
  }

  async patch(
    id: string,
    createOrUpdateDriverDto: CreateOrUpdateDriverDto,
    session: ClientSession,
  ) {
    const {
      vehicle,
      birthday,
      driverLicense,
      addressInformation,
      bankingInformation,
      contactInformation,
      ...rest
    } = createOrUpdateDriverDto;

    return this.update(
      id,
      {
        ...rest,
        ...(birthday === null
          ? { $unset: { birthday: '' } }
          : { birthday }),
        ...(vehicle ? { vehicle } : {}),
        ...(driverLicense ? { driverLicense } : {}),
        ...(addressInformation ? { addressInformation } : {}),
        ...(bankingInformation ? { bankingInformation } : {}),
        ...(contactInformation ? { contactInformation } : {}),
      },
      session,
    );
  }
}
