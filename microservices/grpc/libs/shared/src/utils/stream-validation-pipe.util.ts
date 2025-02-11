import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { catchError, from, map, of } from 'rxjs';

@Injectable()
export class StreamValidationPipe<T> implements PipeTransform {
  transform(value: T, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    if (!metadata || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = validate(object);

    return from(errors).pipe(
      map((err) => {
        throw err?.['constraints'] ?? 'Validation error';
      }),
      catchError(() => of(object)),
    );
  }

  toValidate(metatype: any) {
    const types = [String, Boolean, Number, Array, Object];

    return !types.includes(metatype);
  }
}
