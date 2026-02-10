import { ValidationPipe } from '@nestjs/common';

export const rabbitmqValidationPipe = new ValidationPipe({
  transform: true,
  errorHttpStatusCode: 400,
  forbidNonWhitelisted: true,
  validateCustomDecorators: true,
});
export const HEADERS_EXCHANGE = 'amq.headers';
export const DRIVER_VERIFICATION_REQ_QUEUE = 'driver.verification.req';
export const DRIVER_VERIFICATION_REQ_HEADER = 'driver-verification-req';
export const DRIVER_VERIFICATION_REQ_RES_QUEUE = 'driver.verification.req.res';
export const DRIVER_VERIFICATION_REQ_RES_HEADER = 'driver-verification-req-res';
