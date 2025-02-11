import { ChecksumAlgorithm } from '@aws-sdk/client-s3';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { Chunk } from '../../assets/interfaces/file-upload.interface';

export class ChunkDto implements Chunk {
  @IsUUID()
  id: string;

  @IsString()
  checksum: string;

  @IsInt()
  partNumber: number;

  @IsEnum(ChecksumAlgorithm)
  checksumAlgorithm: ChecksumAlgorithm;

  @IsString()
  fileName: string;

  @IsNotEmpty()
  data: Uint8Array;

  @IsNumber()
  totalSize: number;
}
