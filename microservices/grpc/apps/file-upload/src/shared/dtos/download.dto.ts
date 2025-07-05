import { IsUUID } from 'class-validator';

import { DownloadRequest } from '../../assets/interfaces/file-upload.interface';

export class DownloadDto implements DownloadRequest {
  @IsUUID()
  id: string;
}
