import { ValidationPipe } from '@nestjs/common';

export const rabbitmqValidationPipe = new ValidationPipe({
  transform: true,
  errorHttpStatusCode: 400,
  forbidNonWhitelisted: true,
  validateCustomDecorators: true,
});
