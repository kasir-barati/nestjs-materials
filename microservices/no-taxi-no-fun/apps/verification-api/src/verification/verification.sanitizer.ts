import { Pagination } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ReadVerificationDto } from './dto/response.dto';
import { Verification } from './entities/verification.entity';

@Injectable()
export class VerificationSanitizer {
  toRead(
    unsanitized: Pagination<Verification>,
  ): Pagination<ReadVerificationDto> {
    const { data, ...rest } = unsanitized;
    const sanitizedVerifications: ReadVerificationDto[] = [];

    for (const unsanitizedVerification of data) {
      const {
        driverId,
        vehicleVerification,
        identityVerification,
        drivingLicenseVerification,
        ...rest
      } = unsanitizedVerification;
      let sanitizedVerification: ReadVerificationDto = {
        ...rest,
        driverId: driverId.toString(),
      };

      if (vehicleVerification) {
        const { inspectionDate, ...restOfVehicleVerification } =
          vehicleVerification;

        sanitizedVerification = {
          ...sanitizedVerification,
          vehicleVerification: {
            ...restOfVehicleVerification,
            inspectionDate: inspectionDate.toISOString(),
          },
        };
      }

      if (drivingLicenseVerification) {
        const { completedAt, ...restOfDrivingLicenseVerification } =
          drivingLicenseVerification;

        sanitizedVerification = {
          ...sanitizedVerification,
          drivingLicenseVerification: {
            ...restOfDrivingLicenseVerification,
            completedAt: completedAt.toISOString(),
          },
        };
      }

      if (identityVerification) {
        const {
          completedAt: identityVerificationCompletedAt,
          ...restOfIdentityVerification
        } = identityVerification;

        sanitizedVerification = {
          ...sanitizedVerification,
          identityVerification: {
            ...restOfIdentityVerification,
            completedAt:
              identityVerificationCompletedAt.toISOString(),
          },
        };
      }

      sanitizedVerifications.push(sanitizedVerification);
    }

    return {
      ...rest,
      data: sanitizedVerifications,
    };
  }
}
