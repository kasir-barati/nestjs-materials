import { BadRequestException } from '@nestjs/common';

export class NullFieldError extends BadRequestException {
  constructor(fieldName: string) {
    super('NullField', {
      description: `Cannot remove a field (${fieldName}) that already exits in the resource!`,
    });
  }
}
