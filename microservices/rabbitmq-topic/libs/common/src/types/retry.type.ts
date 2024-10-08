import { IsInt, IsOptional } from 'class-validator';

export class Retry {
  @IsOptional()
  @IsInt()
  retryCount?: number;
}
