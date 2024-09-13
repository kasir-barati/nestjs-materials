import { ApiProperty } from '@nestjs/swagger';
import { Pagination } from '../database.type';

type Constructor<T = {}> = new (...args: any[]) => T;

export function PaginationMixin<Document extends Constructor>(
  Base: Document,
) {
  class PaginationGenericDto implements Pagination<Document> {
    @ApiProperty({
      type: Number,
      example: 3,
      description: 'Page number',
    })
    page: number;

    @ApiProperty({
      type: Number,
      example: 10,
      description: 'Offset these many documents from page.',
    })
    limit: number;

    @ApiProperty({
      type: Number,
      example: 100,
      description: 'How many document exists in backend in total.',
    })
    total: number;

    @ApiProperty({
      type: Number,
      example: 10,
      description:
        'Last page, calculated according to the passed page and limit.',
    })
    lastPage: number;

    @ApiProperty({
      type: Number,
      example: 2,
      description:
        'Previous page. Null means that there is no previous page and the current page is as far as you can go backward.',
    })
    prev: number | null;

    @ApiProperty({
      type: Number,
      example: 2,
      description:
        'Next page. Null means that there are not any more pages.',
    })
    next: number | null;

    @ApiProperty({
      type: Base,
      isArray: true,
      description: 'Documents.',
    })
    data: Document[];
  }

  return PaginationGenericDto;
}
