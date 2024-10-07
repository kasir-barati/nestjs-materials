import { Pagination } from '@app/common';
import { ReadLogDto } from '../dto/read-log.dto';
import { Log } from '../entities/log.entity';

export class AuditLogSerializer {
  toRead(unserialized: Pagination<Log>): Pagination<ReadLogDto> {
    const { data, ...rest } = unserialized;
    const serializedData: ReadLogDto[] = [];

    for (const unserializedLog of data) {
      const { _id, createdAt, ...rest } = unserializedLog;

      serializedData.push({
        _id: _id.toString(),
        createdAt: createdAt.toISOString(),
        ...rest,
      });
    }

    return {
      ...rest,
      data: serializedData,
    };
  }
}
