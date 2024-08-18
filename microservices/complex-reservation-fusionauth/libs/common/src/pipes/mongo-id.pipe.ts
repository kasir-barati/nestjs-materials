import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isMongoId } from 'class-validator';

@Injectable()
export class MongoIdPipe
  implements PipeTransform<string, string | never>
{
  transform(value: string, _metadata: ArgumentMetadata) {
    if (!isMongoId(value)) {
      throw new BadRequestException('InvalidObjectId');
    }
    return value;
  }
}
