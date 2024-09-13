import { Injectable } from '@nestjs/common';
import {
  CreatedOrUpdatedDriverDto,
  FindByIdDriverDto,
} from './dto/response.dto';
import { Driver } from './entities/driver.entity';

@Injectable()
export class DriverSanitizer {
  toCreatedOrUpdatedDriver(
    unsanitized: Driver,
  ): CreatedOrUpdatedDriverDto {
    const { driverLicense, vehicle, createdAt, updatedAt, ...rest } =
      unsanitized;
    let result: CreatedOrUpdatedDriverDto = {
      ...rest,
      createdAt: createdAt?.toISOString(),
      updatedAt: updatedAt?.toISOString(),
    };

    if (driverLicense) {
      const { expirationDate, ...restOfDriverLicense } =
        driverLicense;

      result = {
        ...result,
        driverLicense: {
          ...restOfDriverLicense,
          expirationDate: expirationDate?.toISOString(),
        },
      };
    }

    if (vehicle) {
      const {
        manufactureDate,
        insuranceExpirationDate,
        ...restOfVehicle
      } = vehicle;

      result = {
        ...result,
        vehicle: {
          ...restOfVehicle,
          manufactureDate: manufactureDate?.toISOString(),
          insuranceExpirationDate:
            insuranceExpirationDate?.toISOString(),
        },
      };
    }

    return result;
  }

  toFindByIdDriver(unsanitized: Driver): FindByIdDriverDto {
    return this.toCreatedOrUpdatedDriver(unsanitized);
  }
}
