import { Injectable } from '@nestjs/common';
import { BodyDto } from './dto/body.dto';
import { QueryStringDto } from './dto/query-string.dto';

@Injectable()
export class AppService {
  patchHello(body: BodyDto) {
    return body;
  }
  getHello(queryStrings: QueryStringDto) {
    return queryStrings;
  }
}
