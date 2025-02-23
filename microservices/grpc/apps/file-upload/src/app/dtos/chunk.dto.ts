import { ChecksumAlgorithm } from '@aws-sdk/client-s3';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Chunk } from '../../assets/interfaces/file-upload.interface';

export class ChunkDto implements Chunk {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  checksum?: string;

  @IsInt()
  partNumber: number;

  @IsOptional()
  @IsEnum(ChecksumAlgorithm)
  checksumAlgorithm?: ChecksumAlgorithm;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsNotEmpty()
  data: Uint8Array;

  @IsOptional()
  @IsNumber()
  totalSize?: number;
}
