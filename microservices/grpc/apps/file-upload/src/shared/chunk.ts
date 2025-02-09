import { FileHandle, open } from 'fs/promises';
import { ChunkStatus } from './chunk-status.enum';
import { getMd5 } from './get-md5.util';

export class Chunk {
  private status: ChunkStatus;
  private _size: number;
  private md5?: string;
  private _md5Bytes?: Buffer;
  private _etag?: string;
  private _partNumber: number;
  private _path: string;

  constructor(
    path: string,
    partNumber: number,
    chunkSizeBytes = 1073741824,
  ) {
    this._path = path;
    this.status = ChunkStatus.PLANNED;
    this._size = chunkSizeBytes;
    this._partNumber = partNumber;
  }

  get md5Bytes() {
    return this._md5Bytes;
  }

  get size() {
    return this._size;
  }

  get etag() {
    return this._etag;
  }

  get partNumber() {
    return this._partNumber;
  }

  get path() {
    return this._path;
  }

  async createChunk(
    reader: FileHandle,
    memorySizeBytes = 104857600,
  ): Promise<void> {
    const writer = await open(this._path, 'w');

    let bytesReadTotal = 0;

    while (bytesReadTotal < this._size) {
      const buffer = Buffer.alloc(
        Math.min(memorySizeBytes, this._size - bytesReadTotal),
      );
      const { bytesRead } = await reader.read(
        buffer,
        0,
        buffer.length,
        null,
      );

      if (bytesRead === 0) {
        break;
      }

      await writer.write(buffer.subarray(0, bytesRead));

      bytesReadTotal += bytesRead;
    }

    await writer.close();

    this.md5 = await getMd5(this._path, 104857600);
    this._md5Bytes = await getMd5(this._path, 104857600, false);
    this.status = ChunkStatus.CREATED;
  }

  validate(etag: string): boolean {
    this._etag = etag;
    return etag === this.md5;
  }
}
